---
layout: default
title: "Lecture 8: Introduction to pthreads"
---

C Review
========

Array / pointer duality

-   name of array is equivalent to pointer to first element of that array
-   pointer treated like an array whose first element is the variable the pointer points to

This is useful for splitting up problems into parts

-   so each processor can work on one part of the array

Threads
=======

A thread is like a "virtual CPU"

Multiple threads execute within the same *process*

-   A process is an *address space*: in other words, a memory space
-   Therefore, multiple threads can access and modify the same **data**
-   Need to be careful!

Analogy: children playing with blocks

-   Children are the threads
-   Blocks are the data
-   Piles/structures of blocks are data structures
-   2 or more children working on a structure at the same time: bad
-   Children should *wait their turn* to work on a structure

Making threads wait their turn is called *synchronization*

Pthreads
========

Pthreads = "POSIX Threads"

A standard API for writing multithreaded programs on Unix

Also supported by Cygwin under windows.

Brief overview of API:

-   **pthread\_create**: *Parent* thread calls to start a new *child* thread.
-   **pthread\_exit**: Called by a thread when it is done.
-   **pthread\_join**: Called by a parent thread to wait for a child thread to exit.

Important data type: **pthread\_t**

-   Serves as an *identifier* for a thread.
-   **pthread\_self** function: returns the thread identifier of the currently-executing thread

Each child thread executes a *start function*. The start function is analogous to the **main** function in a C/C++ program (or the **main** method in a Java program).

[Review synopsis of each API function.]

[Write a hello world using pthreads.]

Embarrassing Parallelism
========================

Problems that are extremely easy to solve using parallel computation are called *embarrassingly parallel*.

Typical structure:

-   Main process divides up problem into equal sized chunks.
-   Main process starts a worker process to process each chunk. The workers *do not communicate with each other*.
-   Main process waits for workers to finish.
-   Main process combines worker solutions into a single global solution.

Example application: computing the sum of an array of 16 bit integers.

Question: how would you parallelize this computation?

Example pthreads program: [hello\_pthread,c](hello_pthread.c)

Lab 6
=====

Parallelize a sequential program to compute the sum of an array of 16 bit integer values.
