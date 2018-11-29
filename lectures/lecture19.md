---
layout: default
title: "Lecture 19: Concurrency in Clojure"
---

[Clojure](http://clojure.org) and [Erlang](http://www.erlang.org) are functional languages that have built-in support for concurrency.

Because they are functional languages (employing a programming model where most data structures are immutable), they allow the programmer to avoid some common types of errors (e.g., race conditions) that are common when using concurrency in imperative languages.

# Concurrency in Clojure

## Look Ma, no locks!

*None* of the native concurrency features in Clojure use locks.

Example code: [clojure-concurrency.zip](clojure-concurrency.zip), is an Eclipse/Counterclockwise project using Leiningen.

## Mandelbrot set computation

Example computation: the [Mandelbrot Set](http://en.wikipedia.org/wiki/Mandelbrot_set), a computation that computationally expensive and has easily exploitable parallelism.

Here is a very basic sequential implementation of the Mandelbrot set computation.  The goal is to compute a grid of iteration counts, where each item in the grid is the number of times the equation

> Z = Z<sup>2</sup> + C

can be iterated before the magnitude of Z reaches 2, where C is an arbitrary complex number, Z is initially 0+0i, and the number of iterations is subject to a maximum number of iterations.  If the maximum iteration count is reached, then C is assumed to be in the Mandelbrot set.

{% highlight clojure %}
;; ------------------------------------------------------------
;; Complex numbers
;; ------------------------------------------------------------

; Ensure that complex numbers use doubles to represent the
; real and imaginary components.
(defn make-complex [r i]
  [(double r) (double i)])

(defn complex-add [[a b] [c d]]
  [(+ a c) (+ d b)])

(defn complex-mul [[a b] [c d]]
  [(- (* a c) (* b d)) (+ (* b c) (* a d))])

(defn complex-magnitude [[r i]]
  (Math/sqrt (double (+ (* r r) (* i i)))))

;; ------------------------------------------------------------
;; Mandelbrot set computation
;; ------------------------------------------------------------

; Starting from z = 0+0i, iterate z = z^2 + c until the magnitude
; of z reaches 2 or a maximum iteration count is reached.
(defn mandelbrot-iter [c maxiters]
  (loop [z (make-complex 0 0)
         count 0]
    (if (or (> (complex-magnitude z) 2) (>= count maxiters))
      count
      (recur (complex-add (complex-mul z z) c) (+ count 1)))))

; Compute a single row of iteration counts, starting from
; given real/imaginary values, incrementing real values by r-incr,
; generating n iteration counts, using maxiters as the maximum number
; of iterations.
(defn mandelbrot-compute-row [r i r-incr n maxiters]
  (mapv (fn [index]
          (mandelbrot-iter (make-complex (+ r (* r-incr index)) i) maxiters))
        (range 0 n)))

; Sequential computation, returns a sequence of rows, where
; each row is a sequence of iteration counts as computed
; by mandelbrot-compute-row.  Computes every n'th row starting
; from startrow.
(defn mandelbrot-compute-grid-seq [rmin imin rmax imax ncols nrows maxiters startrow n]
  (let [r-incr (/ (- rmax rmin) ncols)
        i-incr (/ (- imax imin) nrows)]
    (mapv (fn [row]
            (mandelbrot-compute-row rmin (+ imin (* row i-incr)) r-incr ncols maxiters))
          (range startrow nrows n))))

; Sequential computation, computing every row from 0 to nrows-1.
(defn mandelbrot-compute-grid-seq-all [rmin imin rmax imax ncols nrows maxiters]
  (mandelbrot-compute-grid-seq rmin imin rmax imax ncols nrows maxiters 0 1))
{% endhighlight %}

The `mandelbrot-compute-grid-seq-all` function performs a purely sequential computation.  On my computer, the call

{% highlight clojure %}
(mandelbrot-compute-grid-seq-all -2 -2 2 2 200 200 1000)
{% endhighlight %}

takes about 1.8 seconds to complete.

## Futures

One of the simplest and most useful concurrency constructs in Clojure is the *future*.  The `future` function takes a series of arbitrary expressions, returns a future.  A future is "potential" value: its value may not be known at the current time, but will be known at some point in the future.  A value of a future can be determined using the `deref` function.  If the future's value is known, then deref returns it.  If the future's value is not known yet (because its thread is still not finished), then `deref` waits until the value is ready.  The eventual value of a future is the value of the last evaluated expression.  Most futures only evaluate a single expression, since only one result can be produced by the future.

Futures support a very straightforward style of fork/join parallelism.  For example, here is a parallel implementation of the Mandelbrot set computation that creates one future per row of the grid:

{% highlight clojure %}
; Parallel computation using one future per row.
(defn mandelbrot-compute-grid-par-futures [rmin imin rmax imax ncols nrows maxiters]
  (let [r-incr (/ (- rmax rmin) ncols)
        i-incr (/ (- imax imin) nrows)
        row-fn (fn [row]
                 (future (mandelbrot-compute-row rmin (+ imin (* row i-incr))
                                                 r-incr ncols maxiters)))
        future-results (mapv row-fn (range 0 nrows))]
    (mapv deref future-results)))
{% endhighlight %}

On my computer, which has 3 CPU cores, the function call

{% highlight clojure %}
(mandelbrot-compute-grid-par-futures -2 -2 2 2 200 200 1000)
{% endhighlight %}

takes about 1 second to complete.

Because each future creates a new thread, and because thread creation and cleanup adds overhead to the computation, it may be helpful to create a fixed number of futures, and allow each future to work on a larger chunk of the overall problem.  For example, here is an "interleaved" version of the parallel Mandelbrot set computation, in which the number of futures to be created is specified as a parameter *n*, and each future computes every *n*th row.  The results computed by the futures (once waited for using `deref`) are then combined into a single sequence using the `interleave` function.

{% highlight clojure %}
; Parallel computation using a fixed number of futures.
; The computation performed by each future handles every n'th
; row (by making a call to mandelbrot-compute-grid-seq).
; This is a relatively efficient way to split up the
; computation over a fixed number of threads.
(defn mandelbrot-compute-grid-par-futures-interleaved [rmin imin rmax imax ncols nrows maxiters nthreads]
  (let [every-nth-row-fn (fn [j]
                           (future (mandelbrot-compute-grid-seq rmin imin rmax imax ncols nrows maxiters j nthreads)))
        partial-results (mapv every-nth-row-fn (range 0 nthreads))]
    (apply interleave (mapv deref partial-results))))
{% endhighlight %}

On my computer (3 cores) the function call

{% highlight clojure %}
(mandelbrot-compute-grid-par-futures-interleaved -2 -2 2 2 200 200 1000 3)
{% endhighlight %}

takes about .75 seconds.

## pcalls and pmap

The `pcalls` and `pmap` functions invoke functions in parallel and builds a list of results.

`pmap` invokes a single function (in parallel) on each element of a list (or other sequence):

`pmap` works more or less the same as `map`, but if the computation being performed for each element of the sequence is expensive, could allow parallelism.

`pcalls` invokes an arbitrary series of 0-argument functions in parallel and builds a list containing the results. (We'll see a use of `pcalls` in the next section.)

## Refs, software transactional memory

For some concurrent computations, you may want to use shared mutable state. Clojure makes it relatively easy to express these kinds of computations through *software transactional memory*. The idea is that the state that can change is expressed as *refs*. A ref is a "box" that holds a value, but the value in the box can be changed at any time.

The value of a ref can only be changed within a *transaction*. A transaction may read the values of refs as well as modify the values of refs. When the end of a transaction is reached, its results are *committed* only if the values of the refs have not been changed by another transaction. This means that the effects (modifications to shared data) of a transaction either take effect completely, or not at all. No explicit locking or synchronization by the program is required.

Example: map coloring. Given a map --- for example, a map of the US --- assign colors to the geographical regions (e.g. states) such that neighboring regions never have the same color.

A simple way to find a map coloring is to start by assigning all regions the same color, and then, for each region, looking at neighboring regions and attempting to find a color that is not used by any neighboring region.

In the source file `statecolors.clj` is a program that uses the `pcalls` function to attempt to find a legal color for each US state, based on the [adjacency lists for each state](http://writeonly.wordpress.com/2009/03/20/adjacency-list-of-states-of-the-united-states-us/).

The `find-state-colors` function uses `pcalls` to start a worker function for each state. Each worker repeatedly executes a transaction which

-   checks the colors of the neighbors
-   if possible, updates the state's color to be a color not used by any of its neighbors

The `state-colors` vector contains one ref for each state, where the value of each ref is initially set to red:

{% highlight clojure %}
def state-colors
  (vec (repeatedly (count state-adjacency-list) (fn [] (ref :red)))))
{% endhighlight %}

The `update-state-color` function attempts to change the color of a particular state to be different than its neighbors (if necessary):

{% highlight clojure %}
; Attempt to update the color assigned to given state
; in order to make it different than its neighbors.
; Returns true if a good color was found, false otherwise.
(defn update-state-color [state]
  (let [my-color (deref (get state-colors (state-index state)))
        neighbor-colors (get-neighbor-colors state)]
    (if (not (contains? neighbor-colors my-color))
      ; Current color is ok
      true
      ; See what colors are available (not used by neighbors)
      (let [candidates (clojure.set/difference colors neighbor-colors)]
        (if (empty? candidates)
          ; Neighbors have already used all available colors,
          ; so there's no point in choosing a new color
          false
          (do
            ; Set new state color randomly from available candidate colors
            (ref-set (get state-colors (state-index state)) (rand-nth (seq candidates)))
            ; As far as we know, the state's color is now good
            true))))))
{% endhighlight %}

Because this function updates refs, it must be executed in a transaction using `dosync`.  This is done by the `worker` function, which attempts to find a color for a given state:

{% highlight clojure %}
; Worker function: for some number of iterations, attempt to
; update state color of given state to be different than its
; neighbors.
(defn worker [state num-iters]
  ;(println "Finding color for state " state " using " num-iters " iterations")
  (loop [count 0
         color-is-ok false]
    (if (>= count num-iters)
      (do
        ;(println "Finished for " state)
        color-is-ok)
      (let [found-legal (dosync (update-state-color state))]
        (recur (+ count 1) found-legal)))))
{% endhighlight %}

The result of the overall call to the worker function is a boolean which indicates whether or not a legal color was found for the state.

The `find-state-colors` function invokes the worker function in parallel, once for each state:

{% highlight clojure %}
; Create parallel tasks for each state, use them to find a possible
; color for each state.  Each worker will use maxiters as its number
; of iterations.
(defn find-state-colors [maxiters]
  (apply pcalls (map (fn [state] (fn [] (worker state maxiters))) (keys state-to-index-map))))
{% endhighlight %}

Note that the result of the call to `map` is a list of functions, where each function will invoke the `worker` function with the specified state value and maximum number of iterations.  The result of `pcalls` is a list containing the result of each parallel function.

Example run in the Clojure REPL (user input in **bold**):

<pre>
=> <b>(find-state-colors 4000)</b>
(true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true true)
</pre>

In this case, valid colors were found for all states.

The `check-state-colors` function checks the final `state-colors` vector to ensure that each state was assigned a color different from its neighbors:

{% highlight clojure %}
; Check whether a given state has neighbors which are all
; of different colors.
(defn check-state [state]
  (let [my-color (deref (get state-colors (state-index state)))
        neighbor-colors (get-neighbor-colors state)]
    (let [ok (not (contains? neighbor-colors my-color))]
      (if (not ok)
        (println "Failed to find color for " state))
      ok)))
{% endhighlight %}

Calling `check-state-colors` to ensure that the computation was successful:

<pre>
=> <b>(check-state-colors)</b>
true
</pre>

Note that the algorithm used by this program is not guaranteed to find a valid coloring: if a state's neighbors use all possible colors, then the state's worker will be unable to set a valid color.  A possible solution would be to have the state's worker randomly change the color of one of its neighbors if this happens.

## Atoms

Atoms: kind of like refs, but there is no support for transactions.  Each atom supports atomic updates to its value, but the updates are independent of other atoms.

## Agents

Agents are much like actors in Erlang and Scala: an agent is a sequential process that receives messages and processes them, and may send messages to other actors.

An interesting characteristic of agents in Clojure is that messages are functions that operate on two values:

-   The agent's current data
-   Message data (that is explicitly sent to the agent)

The result of a message function becomes the new "current data" of the agent.

Really simple example:

{% highlight clojure %}
(defn say [count msg]
  (do
    (println count)
    (println msg)
    (+ count 1)))
{% endhighlight %}

Dynamically creating an actor and sending it some messages:

<pre>
user=> <b>(def my-agent (agent 1))</b>
#'user/my-agent
user=> <b>(send my-agent say "Hello")</b>
1
Hello
#<Agent@10e98462: 2>
user=> <b>(send my-agent say "World")</b>
2
World
#<Agent@10e98462: 2>
</pre>

In this example, the agent's data is a number that is incremented each time the **say** message is received.

<!-- vim:set wrap: ­-->
<!-- vim:set linebreak: -->
<!-- vim:set nolist: -->
