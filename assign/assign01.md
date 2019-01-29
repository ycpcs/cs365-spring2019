---
layout: default
title: "Assignment 1: Grid datatype"
---

**Due: Friday, Feb 1st by 11:59 PM**

Grid Datatype
=============

Your task is to implement the **Grid** datatype. This datatype is an important component of the next assignment, which is a parallel implementation of [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life).

An instance of **Grid** represents a 2-dimensional grid of **uint8\_t** (8 bit unsigned integer) elements with a specified number of rows and columns. Within each **Grid** instance, there are two *buffers*, each of which stores a complete set of elements: the *current generation* buffer and the *next generation* buffer. The idea is that in the simulation of Conway's Game of Life, the values in the current generation buffer will be used to compute the values in the next generation buffer.

Getting started
---------------

Download [CS365\_Assign01.zip](CS365_Assign01.zip) and unzip it. In a Unix shell, change directory into the **CS365\_Assign01** directory.

You can do your development work on the cluster head node or your own local machine. If you are using Windows, you will need [Cygwin](http://cygwin.com/).

Functions to implement
----------------------

You will need to add any necessary fields to the **Grid** datatype, which is declared in the header file **grid.h**:

```c
typedef struct {
    int rows;
    int cols;
    // TODO: add other fields
} Grid;
```

The **rows** and **columns** fields should store the number of rows and columns in the grid. You should add fields to store pointers to the buffers for the current and next generations.

You will need to implement the following functions, which are also declared in **grid.h**:

```c
// 
// Create a Grid instance with given number of rows and columns.
// All elements of both the current and next generations should
// be set to 0.
// 
Grid *grid_alloc(int rows, int cols);

// 
// Free a Grid instance previously allocated by grid_alloc.
// 
void grid_destroy(Grid *grid);

// 
// Flip the buffers in given Grid instance, so that the next
// generation becomes the current generation and the current
// generation becomes the next generation.
// 
void grid_flip(Grid *grid);

//
// Get the value stored in given row and column of the current
// generation of the given Grid.
//
uint8_t grid_get_current(Grid *grid, int row, int col);

//
// Set the value stored in given row and column of the next
// generation of the given Grid.
//
void grid_set_next(Grid *grid, int row, int col, uint8_t val);
```

The implementations of these functions should go in **grid.c**.

Compiling and testing
---------------------

Before starting, run the command **make depend**. This will ensure that files are recompiled appropriately when source and header files are modified.

To compile, run the command **make**.

The file **testgrid.c** contains unit tests for the **Grid** functions. You should read the code in this file, since it demonstrates how the **Grid** datatype is intended to be used. To run the tests, execute the command **./testgrid**.

Hints
-----

You should add two fields to the **Grid** datatype that are pointers to **unit8\_t**. These are pointers to dynamically-allocated arrays for the current and next generations.

**grid\_alloc** should do the following:

-   dynamically allocate a **Grid** instance
-   initialize its **rows** and **cols** fields
-   dynamically allocate two arrays of **uint8\_t** elements, assign them to fields (these are the buffers for the current and next generations)
-   return a pointer to the **Grid** instance

**grid\_destroy** should free all of the memory allocated by **grid\_alloc**.

**grid\_flip** should swap the current and next generation pointers.

**grid\_get\_current** retrieves the value at the given row/column in the current generation buffer.

**grid\_set\_next** sets the value at the given row/column in the next generation buffer.

You will need to work out a way of storing all of the values in the two-dimensional grid in the buffers you allocate.

Submitting
==========

To submit, run the command **make submit**. Enter your Marmoset username and password when prompted.
