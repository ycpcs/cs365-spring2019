---
layout: default
title: "Lecture 10: Condition Variables"
---

Condition Variables
===================

Condition variables allow threads to sleep waiting for a condition

> something that must be true in order for the continue doing useful work

A condition is a predicate on the state of shared data: e.g., "the counter is at least 10,000".

Declaring a condition variable - variable whose type is **pthread\_cond\_t**.

Threads that enable a condition (making a condition true) must "wake up" threads waiting on the condition.

The condition must be associated with a mutex which is used to protect the shared data tested by the condition.

The mutex must be locked when a thread waits on or enables the condition.

Functions
---------

**pthread\_cond\_init**: initialize a condition variable: must be done before any thread uses the condition variable for the first time

**pthread\_cond\_wait**: atomically unlocks a mutex (which must previously have been locked) and adds the calling thread to the condition variable's wait queue. When the thread wakes up and the call returns, the thread will have locked the mutex again.

Two important criteria for correct use:

1.  The condition must be checked with the mutex held. Otherwise, another thread might change the shared data between the time the condition is checked and the time the thread waits.
2.  Must be used within a loop that checks the condition:

In general, a condition variable may be used for multiple conditions: just because the thread was woken up doesn't necessarily mean that the condition it is waiting for is actually true.

**pthread\_cond\_broadcast**: wakes up all threads that are currently waiting on the condition (causing them to return from their calls to **pthread\_cond\_wait**).

**pthread\_cond\_destroy**: Called after all threads are done using a condition variable.

Example - Wait for counter to reach threshold
=============================================

Add an operation to the counter data type from the [previous lecture](lecture09.html) to wait until the counter has reached a specific threshold value. Prototype:

{% highlight cpp %}
void counter_wait_threshold(Counter *c, int threshold);
{% endhighlight %}

We need to add a **pthread\_cond\_t** variable to the **Counter** type:

{% highlight cpp %}
typedef struct {
        int count;
        pthread_mutex_t lock;
        pthread_cond_t cond;   // <-- added this
} Counter;
{% endhighlight %}

The **counter\_init** function can initialize the condition variable using the **pthread\_cond\_init** function:

{% highlight cpp %}
void counter_init(Counter *c)
{
        c->count = 0;
        pthread_mutex_init(&c->lock, NULL);
        pthread_cond_init(&c->cond, NULL); // <-- added this
}
{% endhighlight %}

Operations that change the value of the counter must call **pthread\_cond\_broadcast**. Right now, there is only one operation that changes the value of the counter, **counter\_incr**:

{% highlight cpp %}
void counter_incr(Counter *c)
{
        pthread_mutex_lock(&c->lock);
        int val = c->count;
        val = val + 1;
        c->count = val;
        pthread_cond_broadcast(&c->cond); // <-- added this
        pthread_mutex_unlock(&c->lock);
}
{% endhighlight %}

The idea is that incrementing the counter value may enable a condition that another thread is waiting for — specifically, the counter reaching a specified threshold.

Finally, here is the new **counter\_wait\_threshold**:

{% highlight cpp %}
void counter_wait_threshold(Counter *c, int threshold)
{
    pthread_mutex_lock(&c->lock);

    while (c->count < threshold) {
        pthread_cond_wait(&c->cond, &c->lock);
    }
    // now c->count >= threshold

    pthread_mutex_unlock(&c->lock);
}
{% endhighlight %}

Demo: [pthread\_counter2.zip](pthread_counter2.zip)

> One thread counts up to 10, and another thread uses **counter\_wait\_threshold** to wait until the count reaches 6.

Example - Bounded Queue
=======================

A bounded queue is a very useful communication mechanism when you have *producer* and *consumer* threads. The producer adds items to the queue, the consumer removes them.

The consumer obviously cannot remove an item from the queue if the queue is empty, so the dequeue operation must wait until the queue is non-empty before it can proceed.

In theory, the producer thread could add an item to the queue regardless of how many items it already contains. In practice, we probably want to *bound* the number of items that may be in the queue. Otherwise, if the producer is faster at producing items than the consumer is at consuming them, the number of items in the queue will grow without limit. We can avoid this problem by allowing only a fixed maximum number of items in the queue. So, the enqueue operation should wait until the queue is not *full*.

A bounded queue effectively causes the overall rates at which items are produced and consumed to be equal.

We will assume that we have a **queue\_t** data type that represents a generic queue of items.

The **BoundedQueue** data type represents a bounded queue which may contain up to a given maximum number of items:

{% highlight cpp %}
typedef struct {
    queue_t q; // the queue
    int max;   // max number of items
    int count; // current number of items

    pthread_mutex_t lock;
    pthread_cond_t cond;
} BoundedQueue;
{% endhighlight %}

The **boundedqueue\_init** operation initializes a **BoundedQueue**:

{% highlight cpp %}
void boundedqueue_init(BoundedQueue* bq, int max)
{
    queue_init(&bq->q);
    bq->max = max;
    bq->count = 0;
    pthread_mutex_init(&bq->lock, NULL);
    pthread_cond_init(&bq->cond, NULL);
}
{% endhighlight %}

The **boundedqueue\_enqueue** operation enqueues an item. The item can only be added to the queue if the queue is not full:

{% highlight cpp %}
void boundedqueue_enqueue(BoundedQueue* bq, void *item)
{
    pthread_mutex_lock(&bq->lock);

    while (bq->count >= bq->max) {
        pthread_cond_wait(&bq->cond, &bq->lock);
    }

    queue_enqueue(&bq->q, item);
    bq->count++;
    pthread_cond_broadcast(&bq->cond); // wake up consumer

    pthread_mutex_unlock(&bq->lock);
}
{% endhighlight %}

The loop waits until the queue is not full, calling **pthread\_cond\_wait** each time the queue is found to be full. Once the queue is not full, the item is enqueued and the queue's item count is incremented. Note that we do a **pthread\_cond\_broadcast** at this point because the consumer thread may be waiting for the queue to become nonempty.

The **boundedqueue\_dequeue** operation dequeues an item. It is very similar to **boundedqueue\_enqueue**, except that it waits for the queue to become non-empty:

{% highlight cpp %}
void* boundedqueue_dequeue(BoundedQueue* bq)
{
    pthread_mutex_lock(&bq->lock);

    while (bq->count == 0) {
        pthread_cond_wait(&bq->cond, &bq->lock);
    }

    void *result = queue_dequeue(&bq->q);
    bq->count--;
    pthread_cond_broadcast(&bq->cond); // wake up consumer

    pthread_mutex_unlock(&bq->lock);

    return result;
}
{% endhighlight %}

Demo: [prodcons.zip](prodcons.zip)

> A fast producer thread enqueues the letters A to Z in a bounded queue which may contain up to 5 items. A slow consumer thread consumes the letters at the range of 1 per second. Because the producer is blocked when the queue is full, the producer is forced to slow down to match the rate of the consumer.
