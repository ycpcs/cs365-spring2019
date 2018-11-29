---
layout: default
title: "Lecture 9: Mutexes"
---

Example code: [counter\_unsync.zip](counter_unsync.zip), [counter\_sync.zip](counter_sync.zip)

Pthreads has two primary synchronization primitives:

> **mutex**: ensure that only one thread at a time can access shared data
>
> > guarantees the atomicity of a sequence of accesses to shared data
>
> **condition variable**: allow threads to wait for some condition to be true
>
> > basically, a queue of waiting threads

Mutexes
=======

"Mutex" means "mutual exclusion"

A mutex is used to protect a *critical section*: a sequence of operations that can't be interrupted.

> Generally, a critical section is accessing or modifying a shared data structure.

Declaring a mutex - simply a variable whose type is **pthread\_mutex\_t**

> Typically, each shared data structure that needs to be protected is associated with one mutex
>
> The mutex can be (and usually is) placed inside the data structure to be protected
>
> General rule: accesses to shared data should only be made while the mutex is locked

Functions:

> **pthread\_mutex\_init**: initialize a mutex
>
> > must be done before mutex is used for the first time
>
> **pthread\_mutex\_destroy**: destroy a mutex
>
> > should be done after all threads are done using the mutex
>
> **pthread\_mutex\_lock**: lock/acquire the mutex
>
> > called at beginning of sequence of operations requiring exclusive access to shared data
> >
> > wait until no other thread is using the mutex, then lock it for exclusive access
>
> **pthread\_mutex\_unlock**: unlock/release previously acquired mutex
>
> > called at end of sequence of operations requiring exclusive access to shared data
> >
> > allow other threads to contend for access to the shared data

Mutex Example: shared atomic counter
------------------------------------

> "atomic" means that all operations on a counter happen "all at once"

{% highlight cpp %}
// Unsynchronized version

struct Counter {
    int count;
};

void counter_init(struct Counter *c)
{
    c->count = 0;
}

void counter_incr(struct Counter *c)
{
    int val = c->count;
    val = val + 1;
    c->count = val;
}

int counter_get(struct Counter *c)
{
    int val = c->count;
    return val;
}

// Synchronized version

struct Counter {
    int count;
    pthread_mutex_t lock;
};

void counter_init(struct Counter *c)
{
    c->count = 0;
    pthread_mutex_init(&c->lock, NULL);
}

void counter_incr(struct Counter *c)
{
    int val;

    pthread_mutex_lock(&c->lock);

    val = c->count;
    val = val + 1;
    c->count = val;

    pthread_mutex_unlock(&c->lock);
}

int counter_get(struct Counter *c)
{
    int val;

    pthread_mutex_lock(&c->lock);
    val = c->count;

    pthread_mutex_unlock(&c->lock);

    return val;
}
{% endhighlight %}

The unsynchronized version of this data type would be perfectly fine for a single threaded program.

However, it is not guaranteed to work correctly in a multithreaded program. The reason is that the **counter\_incr** operation is not *atomic*. A complex operation is *atomic* if and only if its sequence of operations is indivisible from the perspective of all threads in the system.

The unsynchronized version of **counter\_incr** is not atomic because while one thread is calling **counter\_incr**, other threads could read and/or modify the counter.

When a complex operation is not atomic, surprising results can occur when multiple threads perform that operation (or other operations on the same data structure.) Consider two threads calling the unsynchronized version of **counter\_incr** at the same time on the same instance of **struct Counter**. Assume that the value of the **count** field is initially 0. Here is one possible interleaving of the execution of the two threads

    Thread 1             Thread 2
    --------------------------------------------
    1: val = c->count;
    2: val = val + 1;
    3: c->count = val;
    4:                   val = c->count;
    5:                   val = val + 1;
    6:                   c->count = val;

This interleaving results in the **count** field having the value 2, which is correct considering that **counter\_incr** was called 2 times on a counter whose initial value was 0.

Now consider a different interleaving:

    Thread 1             Thread 2
    --------------------------------------------
    1: val = c->count;
    2:                   val = c->count;
    3:                   val = val + 1;
    4:                   c->count = val;
    5: val = val + 1;
    6: c->count = val;

In this interleaving, the final value of **count** will be 1, because Thread 2 loaded the value of **count** into its local variable **val** before Thread 1 had a chance to increment **count**. This is called a *lost update* bug because a modification made to a shared data structure was lost. There should have been two increments of the counter, but only one was actually registered.

The synchronized version of the code uses a mutex to ensure that all counter operations are atomic.

A Principle for Writing Correct Multithreaded Programs
======================================================

There is a simple principle to remember when writing multithreaded programs:

> All shared variables must be protected by a mutex. All accesses (reads and writes) of a shared variable must be executed in a critical section in which the mutex protecting the variable is locked.

Ignore this principle at your peril.

Unfortunately, this principle does not guarantee that you will have a correct program, but if you follow it, you will have a far greater chance of having a correct program.

Common Bugs in Multithreaded Programs
=====================================

Deadlock
--------

If two threads acquire two different mutexes in different orders, they can enter a deadlock where neither can make progress.

    Thread 1       Thread 2
    --------------------------
    lock A
                   lock B
    lock B
                   lock A

Each thread is put to sleep indefinitely because the other thread has already acquired the lock it is trying to acquire.

To prevent deadlocks, each thread must acquire locks in a consistent global order.

Data race
---------

Data races arise when two threads access shared data without synchronization, where at least one of the accesses is a write. The counter lost update is an example of a data race.
