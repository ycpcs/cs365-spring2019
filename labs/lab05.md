---
layout: default
title: "Lab 5: Message-Passing Performance"
---

Getting Started
===============

Download [CS365\_Lab05.zip](CS365_Lab05.zip) to your cluster head node account. Unzip it.

You will modify the source files **experiment1.c** and **experiment2.c**. You can run the command **make** to build the two programs.

Your Task
=========

Your task is to perform experiments to measure two performance characteristics of our MPI cluster: *latency* and *bandwidth*.

**Latency** is the amount of time it takes for the first bit of a message sent from one process to be received by a second process.

**Bandwidth** is the rate at which data can be transferred from one process to another. Bandwidth is measured as amount of data per unit of time; e.g., bytes per second.

Use the two provided C source files, **experiment1.c** and **experiment2.c**, to perform the two experiments. You can use the **runpar** script to launch the programs: for example

<pre>
$ <b>./runpar experiment1 2</b>
</pre>

will run the **experiment1** program with two processes.

Hints
-----

To measure latency, write a "ping-pong" program where process 0 sends a small (one byte) message to process 1, and then process 1 sends a small message to process 0. Process 0 can measure the amount of time elapsed from the beginning of its send to the end of its receive, and divide by 2 to find the latency.

To measure bandwidth, process 0 should send a large volume of data (at least 1 megabyte) to process 1. Process 1 should send a small acknowledgement message to process 0 when all of the data has been received. Process 0 can measure the bandwith by measuring the amount of time that has elapsed from when it starts sending the data to when it receives process 1's acknowledgment. **Note**: each **MPI\_Send** operation should send a relatively large amount of data (e.g., 128 KB) to reduce the effect of per-message communication overhead.

Timing
------

You can use the **utime** function to measure time with up to microsecond (millionth of a second) accuracy. Use it as follows:

{% highlight cpp %}
unsigned long start, end, elapsed;

start = utime();

code you want to benchmark

end = utime();

// Find total number of microseconds elapsed
elapsed = end - start;
{% endhighlight %}
