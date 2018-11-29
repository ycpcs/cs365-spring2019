---
layout: default
title: "Lab 17: Clojure futures"
---

Adapt a Clojure implementation of merge sort so that it uses futures to execute the recursive sorts in parallel if the number of elements is less than a threshold value.

You can find an implementation of merge sort in [clojure-concurrency.zip](../lectures/clojure-concurrency.zip), the example code from [Lecture 19](../lectures/lecture19.html).

What kind of parallel speedup do you see?

Try:

<pre>
(def data (shuffle (range 100000)))
(time (do (merge-sort data) "done"))
(time (do (merge-sort-par data) "done"))
</pre>
