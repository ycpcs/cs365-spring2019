---
layout: default
title: "Lab 4: MPI Derived Datatypes"
---

# Getting Started

Download [CS365\_Lab04.zip](CS365_Lab04.zip) to your cluster head node account. Unzip it.  You will edit the code in `column_transfer.c`.

# Your Task

As implemented, the program runs with two parallel processes, each of which allocates an array of integers which it treats as a 2D grid of `NROWS` rows and `NCOLS` columns.  This should remind you of your [Grid Datatype](../assign/assign01.html) implementation.  Process 0 initializes the rightmost "column" of values with predetermined values (multiples of 9), and sends them to process 1.  Process 1 receives these values in its leftmost "column" of values, and prints them out.  The output of the program should be:

	Process 1: 9 18 27 36 45 54 63 72 81 90

Your task is to use an [MPI derived datatype](../lectures/lecture06.html) to allow the entire column of values to be sent using a single `MPI_Send` operation and received using a single `MPI_Recv` operation.  You should modify the code marked by the TODO comments.

After modifying the program, it should produce the same output as before.

## Testing

Use `make` to compile the program.  Use the command

    ./runpar

to run the program.  (It will run with exactly two processes.)

## Hints

Use `MPI_Type_vector` to define the column datatype.

The "grid" allocated by each process is laid out row-by-row.  So, cells in the same column are `NCOLS` number of elements apart.

The elements of the grid are `int`s, so use the `MPI_INT` data type as the element type.
