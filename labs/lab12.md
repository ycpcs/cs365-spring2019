---
layout: default
title: "Lab 12: Lock-free random number generator"
---

# Getting started

Download [CS365\_Lab12.zip](CS365_Lab12.zip) and import it into Eclipse.

You should see a project called **CS365\_Lab12**.

*Update*: download [Benchmark.java](Benchmark.java) and copy it into the `edu.ycp.cs365.rng` package.  This is a useful benchmark program.

# Your task

Modify the **LockFreeRNG** class so that it uses an **AtomicLong** object to update the random number generator seed, rather than relying on a lock for synchronization.

Hint: use **compareAndSet** to update the seed value.

Benchmark the two random number generator implementations (**LockBasedRNG** and **LockFreeRNG**) by having multiple threads generate random numbers.  Under what circumstances (if any) is the lock-free implementation superior to the lock-based implementation?
