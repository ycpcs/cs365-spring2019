---
layout: default
title: "Lab 9: Reader/Writer Locks"
---

Getting Started
===============

Download [CS365\_Lab09.zip](CS365_Lab09.zip). Extract the contents of the archive into a directory.

Using a Unix shell, use the **cd** command to navigate into the directory containing the extracted contents.

Using a text editor, open the file **tree.c**.

When you run the **make** command, the **tree** program will be compiled. To run it:

*numreaders* is the number of reader threads to create. *readcount* is the number of times each reader thread will attempt to read from the tree. The writer will attempt to write *readcount*/10 times to the tree.

Your Task
=========

The **tree.c** program is a simulation of threads reading and writing (modifying) a tree.

A single writer thread attempts to add nodes to the tree. Multiple reader threads attempt to do a random traversal of the tree from its root to a leaf.

The initial version of the program uses a single mutex to guard access to the tree.

Your task is to modify the implementation to use a reader/writer lock.

Question: does the simulation complete more quickly when it uses a reader/writer lock? You can use the **tree\_mutex** program as a comparison. Use the **time** program to measure the execution time: for example,

    time ./tree 4 100000

    time ./tree_mutex 4 100000
