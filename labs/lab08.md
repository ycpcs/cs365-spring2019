---
layout: default
title: "Lab 8: Shared Queue"
---

Getting Started
===============

Download [CS365\_Lab08.zip](CS365_Lab08.zip). Extract the contents of the archive into a directory.

Using a Unix shell, use the **cd** command to navigate into the directory containing the extracted contents.

Using a text editor, open the files **mtqueue.h** and **mtqueue.c**.

When you run the **make** command, the **mtqueue\_test** program will be compiled. To run it:

Your Task
=========

Complete the implementation of the **MTQueue** data type defined in **mtqueue.h** and **mtqueue.c**.

The **MTQueue** data type is an unbounded thread-safe queue. The queue items are represented using the <b>void \*</b> type, meaning that they are pointers to any type of data. Items are added to the queue using the **mtqueue\_enqueue** function, and removed from the queue with the **mtqueue\_dequeue** function.

If **mtqueue\_dequeue** is called when the queue is empty, it should block the calling thread until the queue is non-empty.

The **mtqueue\_wait\_until\_empty** function causes the calling thread to wait until the queue is empty.

<div class="callout">
<b>Note</b>: Do <em>not</em> call <b>mtqueue_wait_until_empty</b> from any of your <b>mtqueue</b> methods.  It is only meant to be used by the test program to determine when the simulation is complete.
</div>

Hints
=====

Use a singly-linked list to keep track of the items that have been added to the queue. Nodes should be added to the tail of the list, and removed from the head of the list. (This allows both enqueue and dequeue operations to be done in constant time.)

Don't forget to use **free** to de-allocate a node's memory when it is removed from the list.

You will need to add a mutex and condition variable(s) as fields of the **MTQueue** type.

Testing
=======

The **mtqueue\_test** program creates one producer threads and two consumer threads. The producer produces items at a rate of 10 per second. The two consumers consume items at a rate of 2 per second (each). Thus, the queue will grow. When the producer has produced 26 items, it will call **mtqueue\_wait\_until\_empty** to wait until the queue is empty. The simulation finishes when the producer thread exits.
