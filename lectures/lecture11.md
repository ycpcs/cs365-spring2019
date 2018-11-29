---
layout: default
title: "Lecture 11: Reader/Writer Locks"
---

# Protecting shared data

Mutexes protect shared data such that only one thread at a time is permitted to access the data.  In general, this is a safe policy, and assuming that all critical sections acquire the mutex, guarantees that accesses to the data by multiple threads will not interfere with each other.

However, there is one important case where multiple threads may safely access shared data concurrently: *reading*.  In fact, if a shared data structure will never be modified by any thread, there is no need for any locking at all.

It is important to recognize that locks (such as mutex locks) impose a performance cost.  There is some inherent overhead in the code required to acquire and release the lock, although this is generally minimal when contention is low.  The more significant performance cost is requiring threads to wait when there is contention.  A thread waiting on a lock is, by definition, not doing any useful computation.  The greater the contention for the lock, the greater the reduction in parallelism.

# Workload, read vs. write

One important consideration in synchronizing access to a shared data structure is the expected *workload*: what mix of operations will be performed on the shared data structure when the program runs?  We can divide accesses into to type, *reads* and *writes*.  A read access reads from the shared data structure, but does not modify it.  A write modifies the shared data structure (and may also read from the shared data structure).

If the workload is guaranteed to consist of only reads, no synchronization is needed.

If the workload consists of both reads and writes, some form of synchronization is needed.

An interesting case is a *mostly-read* workload, where a large percentage of the accesses are reads.  The interesting point to consider is that any number of read accesses can be permitted to proceed concurrently.  However, a write access may not proceed concurrently with any other access (read or write).  A *reader/writer* lock is a lock designed for mostly-read workloads.

# Reader/writer locks

A reader/writer lock is provided by the type `pthread_rwlock_t`.  It is quite similar to a pthreads mutex (`pthread_mutex_t`).  However, it supports two locking functions:

* `pthread_rwlock_rdlock`: acquires a read lock
* `pthread_rwlock_wrlock`: acquires a write lock

Any number of threads may acquire read locks at the same time, so any number of readers are allowed to execute critical sections concurrently.  However, only one thread is allowed to hold a write lock, and no other threads may execute critical sections (read or write accesses) while a thread holds a write lock.
