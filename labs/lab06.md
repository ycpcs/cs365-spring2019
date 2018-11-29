---
layout: default
title: "Lab 6: Pthreads"
---

Getting Started
===============

Download [CS365\_Lab06.zip](CS365_Lab06.zip). Extract the contents of the archive into a directory.

Using a Unix shell, use the **cd** command to navigate into the directory containing the extracted contents.

Using a text editor, open the file **sumu16\_par.c**.

When you run the **make** command, all of the programs in this directory will be compiled.

Your Task
=========

The program **sumu16\_par.c** takes a single command line argument, which is a file containing a large number of unsigned 16-bit integer values (stored in binary format). When executed, the program reads the file into memory, and then computes the sum of all of the values.

Your task is to modify this program to use two threads to perform an equivalent computation in parallel.

> **If you have time**: support a command line option to perform the computation using any number of threads. Each machine in the cluster has a eight core CPU, so 8-way parallelism is possible.

The basic idea is to use two worker threads, each of which computes the sum of half of the array. When both workers have completed, their individual sums can be added to produce the overall sum.

On all nodes of the cluster, you can use the data file

> /usr/local/data/256M.dat

to test your program.

For example, you could run the command

    ./sumu16_par /usr/local/data/256M.dat

to run the program on a file containing 2<sup>30</sup> 16 bit unsigned data values.

The output of the programs (sequential and parallel) should be

    Sum is 4831770778
