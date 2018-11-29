---
layout: default
title: "Lecture 3: MPI"
---

MPI
===

The standard API for message-passing parallel programs.

The [Resources web page](../resources.html) has a link to a good online API reference for MPI.

Basic functions:

**MPI\_Init**  
Must preceed the use of any other MPI functions

**MPI\_Comm\_rank**  
Find out the "rank" of a process. The rank is between 0 and *p* - 1, where *p* is the total number of processes.

**MPI\_Comm\_size**  
Find out the total number of processes.

**MPI\_Send**  
Send a message. Messages are arrays of data elements. The recipient process is identified by its rank.

**MPI\_Recv**  
Receive a message sent by another process. The sender from which the process wants to receive is identified by its rank.

**MPI\_Finalize**  
Called when the program is done and ready to clean-up any MPI-related resouces.

Lab 1
=====

Link: [Lab 1](../labs/lab01.html)

Using MPI, write a parallel program to compute the sum of the integers from 1..*n*, for a value of *n* input by the user.
