---
layout: default
title: "Lab 1: Hello, world in MPI"
---

Getting Started
===============

Download [CS365\_Lab01.zip](CS365_Lab01.zip) to your cluster head node account. Unzip it.

You will make changes to the file **hello\_mpi.c**.

Your Task
=========

Complete the program so that it computes the sum of all integers from 1 to *n* in parallel, where *n* is an integer value entered by the user. Each parallel process of the program should use its rank to choose which range of integers to sum.

Suggested approach:

1.  The process with rank 0 should read the integer value from the user and send it to all of the other processes, (All processes other than rank 0 should start by receiving the integer value from the process with rank 0.)
2.  Each process should sum the integers in a non-overalapping range, based on its rank. (I.e., given *p* processes, the process with rank 0 should sum the first *n* / *p* integers.)
3.  Once the local sum has been computed, each process other than the one with rank 0 should send its local sum to the process with rank 0.
4.  The process with rank 0 should add its local sum to the local sums computed by the other nodes, and print the global sum.

Running the program
===================

Use the included **runpar** script to run the program. It takes a single command line argument, the number of parallel processes to create. E.g.:

    ./runpar 10

To run the program with 10 processes.
