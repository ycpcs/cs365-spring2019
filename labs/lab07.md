---
layout: default
title: "Lab 7: Mutexes in pthreads"
---

Getting Started
===============

Download [CS365\_Lab07.zip](CS365_Lab07.zip). Extract the contents of the archive into a directory.

Using a Unix shell, use the **cd** command to navigate into the directory containing the extracted contents.

Using a text editor, open the file **find\_primes.c**.

When you run the **make** command, the **find\_primes** program will be compiled.

Your Task
=========

Your task is to complete the **find\_primes** program. It should use multiple threads to find all prime numbers in a given range of integers.

As the threads discover prime numbers, they should add them to a shared **PrimeList** data structure by calling the **primelist\_append** function. *You will need to add a mutex to this datatype to synchronize access to the shared fields.*

Hints
-----

Add a **pthread\_mutex\_t** field to the **PrimeList** struct type.

Modify **primelist\_append** so that the **PrimeList**'s mutex is locked when its shared data is accessed (and unlocked before the function returns).

Create a **Work** data type to define the work that each worker thread will do. It should specify which numbers will be tested, and contain a pointer to the shared **PrimeList** data structure. Use an array of **Work** structures to specify the work to be done by each thread.

Create a **worker** function to use as the start function for the threads. This function should test a subset of the overall range of integers as specified by the **Work** struct passed as a parameter to the thread. Each time the **worker** function finds a prime, it should call **primelist\_append** to add it to the list of discovered prime numbers.
