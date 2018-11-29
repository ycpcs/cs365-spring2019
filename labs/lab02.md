---
layout: default
title: "Lab 2: One-dimensional cellular automaton"
---

Getting Started
===============

Download [CS365\_Lab02.zip](CS365_Lab02.zip) to your cluster head node account. Unzip it.

Your task
=========

Your task is to implement a one-dimensional cellular automaton: specifically, one that implements Wolfram's [Rule 30](http://mathworld.wolfram.com/Rule30.html).

A one-dimensional cellular automaton, as the name suggests, is a cellular automaton in which the state is a one-dimensional array of cells. At each time step, a new array of cells is computed from the previous generation of cells.

Sequential computation
======================

The file **rule30.h** defines the following function prototype:

    //
    // Based on the current generation, compute the state of the
    // next generation.
    //
    void rule30_compute_next(const uint8_t *current, uint8_t *next, int num_cells);

The implementation of this function should apply [Rule 30](http://mathworld.wolfram.com/Rule30.html) to compute the value of each cell in the array **next** based on the values of the cells in the array **current**.

You can test your implementation by running the program **rule30\_seq** as follows (user command shown in **bold**):

<pre>
[dhovemey@cscluster]$ <b>./rule30_seq input.txt 14</b>
                   x
                  xxx
                 xx  x
                xx xxxx
               xx  x   x
              xx xxxx xxx
             xx  x    x  x
            xx xxxx  xxxxxx
           xx  x   xxx     x
          xx xxxx xx  x   xxx
         xx  x    x xxxx xx  x
        xx xxxx  xx x    x xxxx
       xx  x   xxx  xx  xx x   x
      xx xxxx xx  xxx xxx  xx xxx
     xx  x    x xxx   x  xxx  x  x
</pre>

Make sure that your output is identical.

Parallel computation
====================

Once your sequential computation is working, modify **rule30\_par.c** to implement a parallel version of the computation using MPI.

Note that the parallel version should only print the state of the *final* generation.

You will need to think about how to accomplish the following:

-   dividing up the work
-   communicating computed cell values to neighbors after each local computation
-   combining all of the local (partial) solutions at the end of the simulation into a complete final generation state

You can run the parallel version of the program using the provided **runpar** script. It takes the same command line arguments as the sequential program (input file and number of generations), and a third argument which specifies how many parallel processes to create.

A good way to test your parallel program is to run it on the test input with increasing numbers of generations, and compare it to the sequential output. For example (user commands in **bold**):

<pre>
[dhovemey@cscluster]$ <b>./runpar input.txt 0 2</b>
...................x....................
[dhovemey@cscluster]$ <b>./runpar input.txt 1 2</b>
..................xxx...................
[dhovemey@cscluster]$ <b>./runpar input.txt 2 2</b>
.................xx..x..................
[dhovemey@cscluster]$ <b>./runpar input.txt 3 2</b>
................xx.xxxx.................
[dhovemey@cscluster]$ <b>./runpar input.txt 4 2</b>
...............xx..x...x................
[dhovemey@cscluster]$ <b>./runpar input.txt 5 2</b>
..............xx.xxxx.xxx...............
[dhovemey@cscluster]$ <b>./runpar input.txt 6 2</b>
.............xx..x....x..x..............
</pre>

In the example above, I am running the program with two parallel processes.
