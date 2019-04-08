---
layout: default
title: "Lab 12: Lock-free random number generator"
---

# Getting started

Download [CS365\_Lab12.zip](CS365_Lab12.zip) and either import it into Eclipse, or unzip it into a folder.

If you will be building the project from the command line, use the command

> `gradle build`

to compile the code.

# Your task

Modify the **LockFreeRNG** class so that it uses an **AtomicLong** object to update the random number generator seed, rather than relying on a lock for synchronization.

Hint: use **compareAndSet** to update the seed value.

Benchmark the two random number generator implementations (**LockBasedRNG** and **LockFreeRNG**) by having multiple threads generate random numbers.  Under what circumstances (if any) is the lock-free implementation superior to the lock-based implementation?

## Running the benchmark

The **Benchmark** class is a useful benchmark program.  You can change the value of the **locking** field to determine whether the lock-based or lock-free random number generator implementation is tested.

Note that you will need to recompile the program when you change the benchmark to choose between the two implementations.
