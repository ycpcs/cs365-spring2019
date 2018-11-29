---
layout: default
title: "Lecture 12: Java Threads, Synchronization"
---

"Classic" Java Threads and Synchronization
==========================================

If you understand pthreads mutexes and condition variables, then Java threads should be pretty easy.

In Java, *any* object can be used as both a mutex and a condition variable. So, in a Java class representing a data structure that will be accessed by multiple threads, you will often see a field like the following:

{% highlight java %}
// protect access to shared data
private Object lock = new Object();
{% endhighlight %}

The field **lock** will be used to protect all critical sections on the shared data, and may also be used to do condition waits and broadcasts.

You will sometimes see Java objects used for synchronization referred to as "monitors".

Starting a thread
-----------------

Create a **Runnable** object as the body of your thread:

{% highlight java %}
public class Worker implements Runnable {
    public void run() {
        // body of thread
    }
}
{% endhighlight %}

Then, use a **Thread** object to execute the **run** method in a new thread:

{% highlight java %}
Worker w = new Worker();
Thread t = new Thread(w);
t.start();
{% endhighlight %}

You can store input to and output from the thread in fields of the **Runnable** object.

To wait for a thread to complete, call the **join** method:

{% highlight java %}
t.join();
{% endhighlight %}

Synchronized blocks
-------------------

Rather than having standalone method calls to lock and unlock a Java monitor, Java instead uses the **synchronized** keyword to identify regions of code that are critical sections.

Simple example: a shared counter (synchronized blocks in **bold**):

{% highlight java %}
public class SharedCounter {
    private Object lock = new Object();

    private int count;

    public SharedCounter() {
        this.count = 0;
    }

    public void increment() {
        synchronized (lock) {
            count++;
        }
    }

    public int get() {
        synchronized (lock) {
            return count;
        }
    }
}
{% endhighlight %}

Each synchronized block specifies the monitor to be locked. You can think of entering a synchronized block as being like a call to **pthread\_mutex\_lock**, and leaving a synchronized block as being like a call to **pthread\_mutex\_unlock**. (Indeed, at the bytecode level, there are special **monitorenter** and **monitorexit** instructions that are essentially lock and unlock operations.)

Java uses a special form of syntax for critical sections to ensure that if the critical section throws an exception, the lock is guaranteed to be released. Otherwise, a monitor could be left in a locked state, meaning that any future attempt to acquire the lock will result in deadlock.

Wait and Notify
---------------

The **wait** and **notifyAll** methods are the Java equivalent of **pthread\_cond\_wait** and **pthread\_cond\_broadcast**. The can be used to allow threads to

-   wait until a condition involving shared data becomes true, and
-   notify other threads that shared data has changed (possibly enabling a condition that other threads are waiting for)

Because each Java monitors is *both* a mutex and a condition variable, the **wait** operation does not need to specify a lock object explicitly — the monitor's internal lock is automatically released and then re-acquired.

Example: adding a **waitThreshold** method to the **SharedCounter** class:

{% highlight java %}
public void waitThreshold(int value) throws InterruptedException {
    synchronized (lock) {
        while (count < value) {
            lock.wait();
        }
    }
}
{% endhighlight %}

Note that we also have to change the **increment** method:

{% highlight java %}
public void increment() {
    synchronized (lock) {
        count++;

        // shared data has changed:
        // notify other thread(s) that may
        // be waiting
        lock.notifyAll();
    }
}
{% endhighlight %}

Note that we have declared the **waitThreshold** method to throw **InterruptedException**. While a thread is waiting on a monitor, it may be "interrupted" by another thread. If a thread is interrupted in this way, its call to **wait** does not return normally, but instead throws **InterruptedException**. This mechanism can be used to "cancel" potentially long-running operations involving waiting on the state of shared data. In practical terms, it means that every time we call the **wait** method we must either handle **InterruptedException** using try/catch, or declare the method as throwing **InterruptedException**.

Java monitors are recursive
---------------------------

One peculiarity of Java monitors is that they are *recursive*: it is legal for a thread to re-acquire a monitor that it has already locked. You can think of each Java monitor as having an internal counter that keeps track of how many times the thread currently holding the lock has entered a synchronized block using that monitor. The monitor is only released (allowing other threads to access it) when the count reaches 0.

In theory, recursive locks allow a method which involves synchronization to invoke another method which synchronizes on the same lock without worrying about self-deadlock. As a contrast, note that pthreads mutex locks are **not** recursive: if a thread in a pthreads program calls **pthread\_mutex\_lock** on a mutex twice without an intevening call to **pthread\_mutex\_unlock**, the thread will instantly deadlock itself.

In practice, it is best to avoid having methods which use synchronization call each other directly. Instead, each method which uses synchronization should call helper methods which do *not* use synchronization. One way to think about this is that all helper methods that directly access shared data have "the monitor must be locked" as a precondition. Then the "front-end" methods that provide high-level operations on the data can acquire the monitor, call the helper methods, and then release the monitor:

{% highlight java %}
public void highLevelOperation() {
    synchronized (lock) {
        ... code ...
        lowLevelHelper();
        ... code ...
    }
}

/*
 * Precondition: the lock must have been acquired already.
 */
private void lowLevelHelper() {
    ... operations that directly use/modify shared data ...
}
{% endhighlight %}

Synchronized Methods
--------------------

Warning: you are about to see a description of a language feature whose use is extremely poor style. **Do not ever, ever use this in your own code. Ever. I'm serious.**

Java allows entire methods to be marked as synchronized. For example, in our **SharedCounter** class, we could omit the **lock** field and object, and instead mark the methods accessing shared data as synchronized:

{% highlight java %}
public class StupidCounter {
    private int count;

    public StupidCounter() {
        this.count = 0;
    }

    public synchronized void increment() {
        count++;
        this.notifyAll();
    }

    public synchronized int get() {
        return count;
    }

    public synchronized void waitThreshold(int value) throws InterruptedException {
        while (count < value) {
            this.wait();
        }
    }
}
{% endhighlight %}

You'll notice that there are no longer any explicit synchronized blocks. Instead, each method which is marked with the **synchronized** keyword implicitly treats its body as if it were contained inside a synchronized block. The question is then "what monitor is locked and unlocked"? The answer is that the object *on which the synchronized method is called* is locked and unlocked. We can see this because the **waitThreshold** method makes the call

{% highlight java %}
this.wait();
{% endhighlight %}

to wait on its condition, implying that "this" is the lock associated with the condition.

This is why synchronized methods are a bad idea. They make the mechanism used to synchronize access to the shared data, which is a *private implementation detail of the class*, exposed to the world. The main danger is that there is nothing preventing *users* of the shared counter object from performing synchronization. For example:

{% highlight java %}
StupidCounter c = new StupidCounter();

... code ...

// trivially deadlock all threads which are using the counter
synchronized (c) {
    while (true) {
        Thread.sleep(1000);
    }
}
{% endhighlight %}

This is a somewhat contrived example. However, programmers may write similar code in a well-meaning attempt to use the class correctly.

So, always use explicit lock objects to protect your class's shared data.
