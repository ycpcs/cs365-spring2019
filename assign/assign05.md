---
layout: default
title: "Assignment 5: Research Project"
---

Proposal: due **Wednesday, Apr 24th** by 11:59 PM

Code and report: due **Wednesday, May 8th** by 11:59 PM

Presentations: **Wednesday, May 15th, 3&ndash;5 PM**

Your Task
=========

You may work individually or in groups of 2 or 3.

Research a topic in parallel or distributed computing. Write a program to demonstrate the technique or algorithm you have researched. Run experiments to analyze the performance/behavior of the program. Write a report summarizing your findings. Give an oral presentation in to present your findings to the rest of the class.

You should discuss your project idea with me no later than **Wednesday, April 19th**.

General Topic Ideas
===================

-   Find a parallel algorithm and implement it using pthreads, MPI, or CUDA
-   Implement a distributed system (in which processes communicate over a network) using TCP/IP
-   Design and implement a parallel algorithm using pthreads, MPI, or CUDA
-   Design, configure, and benchmark a parallel computer

Some Specific Ideas
===================

-   Implement a strategy game such as Checkers or Go using a parallel state space search to consider possible moves.
-   Implement and benchmark a lock-free data structure using atomic machine instructions. See Michael Scott's [High-performance synchronization](http://www.cs.rochester.edu/wcms/research/systems/high_performance_synch/) web page.
-   Use GPGPU computation to implement a parallel algorithm.
-   Implement a 2-processor merge algorithm where one thread starts at the beginning of the arrays being merged, and the second thread starts at the end. Is it possible to make this faster than a sequential merge?
-   Build a small MPI cluster using Infiniband (I have money to buy hardware!), configure it, and benchmark it

It is fine for multiple people/groups to work on the same problem.

Expectations for Report and Presentation
========================================

In your report, you should evaluate the program or algorithm you implemented.  For example, compare its running time to an equivalent sequential implementation, and then determine the parallel speedup.  You might also compare your implementation to a different parallel implementation, or a parallel implementation of a different algorithm solving the same problem.  Provide quantitative results from your experiment(s).  Use plots or charts as apporpriate.  In general, your goal in presenting your evaluation is to provide a sense of what advantages your implementation has over a sequential computation, and under what circumstances it will be have an advantage over sequential computation.

Your presentation should be organized roughly as follows:

* Describe the problem
* Describe your implementation
* Present the results of your evaluation
* Conclusions, future work

Your presentation should be no more than 5 minutes, leaving 1 minutes for Q&amp;A.  You should limit your presentation to at most 4 or 5 slides.

Submitting
==========

## Proposal

Submit the proposal to Marmoset as **assign05\_proposal**.


## Code and report

Upload a zip file containing your code and your report to the Marmoset server as **assign05**:

> <https://cs.ycp.edu/marmoset/>

**Important**: After submitting your work, log into the Marmoset server (<https://cs.ycp.edu/marmoset>) and check your submitted files to make sure they are what you intended to submit.  *It is your responsibility to ensure that your work is submitted correctly.*

<!-- vim:set wrap: ­-->
<!-- vim:set linebreak: -->
<!-- vim:set nolist: -->
