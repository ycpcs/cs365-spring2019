---
layout: default
title: "Lab 11: Parallel Sorting using Fork/Join"
---

Getting Started
===============

Download [CS365\_Lab11.zip](CS365_Lab11.zip) on the cluster and unzip it. Change directory to the **CS365\_Lab11** directory.

Make sure that the directory `/usr/local/bin` is on your execution path.  To check, run the command

    which java

If you see the output

    /usr/local/bin/java

then your path is configured correctly.  If you see different input, execute the following command:

    export PATH=/usr/local/bin:$PATH

The compile the program, run the command

    ant

To run the **Benchmark** program, run either

    ant benchmark_seq

    ant benchmark_par

depending if you want sequential or parallel execution.

Note: you can (and should) compile and run your program on one of the compute nodes. For example,

    ssh hitchhiker02

would allow you to run programs on the second cluster node (which is the first compute node). Pick one of **hitchhiker02** through **hitchhiker08**.

Your Task
=========

Modify the **QuickSortTask** class so that it implements a parallel quicksort algorithm. The **compute** method should do the following:

-   If the number of elements to be sorted is less than the threshold, then it should sort them sequentially using **Arrays.sort**. (Use the variant that allows you to specify the start and end indices.)
-   If the number of elements exceeds the threshold, then sequentially partition the elements by calling **Sort.partition**, the result of which is the index of the element between the left and right partitions. Based on this index, create two subtasks that will recursively sort the left and right partitions. Make sure that both subtasks are forked before you join either of them.

One other detail you will need to think about is what threshold value to use to determine when sequential sorting is used. The initial version of the code hard-codes the threshold at 10,000 elements. You can experiment with other values. Hint: could you compute a reasonable value using the number of array elements and number of available CPU cores?

Benchmarking
============

Collect benchmark data for both the sequential and parallel versions of the program. For each datapoint, calculate the speedup, which is the sequential execution time divided by the parallel execution time. What kind of speedups do you observe?
