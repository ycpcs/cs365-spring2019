---
layout: default
title: "MPI Collective Communication"
---

Broadcast
=========

Startup phase - problem to be solved must be broadcast to all nodes.

Loop:

    for (dest = 1; dest < p; dest++) {
      // send problem to dest
    }

Is correct, but could be inefficient, especially if there are many processes.

Tree: say we have 8 processes

<pre>
                    0
                  /   \
Step 0          0       1        0 &rarr; 1
               / \     / \
Step 1        0   2   1   3      0 &rarr; 2, 1 &rarr; 3
             / \ / \ / \ / \
Step 2      0  4 2 6 1 5 3  7    0 &rarr; 4, 2 &rarr; 6, 1 &rarr; 5, 3 &rarr; 7
</pre>


Each right-hand edge is a send/receive to send the initial problem data to a process that doesn't have it already.

For p processes, a "tree broadcast" can complete in lg p steps (the base 2 log of p), much faster than the p steps needed in the loop broadcast.

At each step, how do processes know whether to send or receive?

> At step i:
>
> > All processes j with ranks less than 2<sup>i</sup> send to process w/ rank j + 2<sup>i</sup>

Implementation ...

Wouldn't it be nice if someone wrote this function for us?

    MPI_Bcast(void *buf, int count, MPI_Datatype, int root, MPI_Comm)

`root` is the rank of the process that has the data.

[Change lab 1 to use.]

Reductions
==========

At the end of the computation: one process must collect partial solutions, combine them into a global solution.

Often: global solution is constructed by applying an operation to the elements of the partial solutions (add, subtract, etc.)

E.g., [Lab 1 (MPI hello, world)](../labs/lab01.html) summing partial solutions to "regions" of a series.

    MPI_Reduce(void *operand, void *result, int count, MPI_Datatype,
           MPI_Op op, int root, MPI_Comm)

operand is a pointer to the local partial solution. result is a pointer to the global solution variable/array on the root process.

Example operations:

-   **MPI\_MAX** - maximum
-   **MPI\_SUM** - addition

[many others...]

[Change lab 1 implementation to use.]

Allreduce
=========

Sometimes we need to do a reduction that accumulates a complete solution not on one (root) process, but instead on each process.

E.g., in heat transfer, after each iteration of the computation, we check each computed temperature to see how much it changed. Each process can thus compute a maximum change of its local region of temperatures. The overall (global) algorithm terminates when equilibrium is reached, meaning that the maximum change *over all processes* is less than some defined tolerance.

The processes all need to terminate when global equilibrium is reached. They can use the MPI\_Allreduce operation to find the global maximum change.

    MPI_Allreduce(void *operand, void *result, int count, MPI_Datatype,
              MPI_Op op, MPI_Comm)

It works just like **MPI\_Reduce**, except that there is no root process, and every process must provide a result variable/buffer.
