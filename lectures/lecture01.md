---
layout: default
title: "Lecture 1: C Pointers and Dynamic Memory Allocation"
---

C Pointers
==========

Pointers are a powerful and dangerous feature of C.

Pointer values, variables, and types
------------------------------------

A pointer value is the address of a variable or a chunk of dynamically-allocated memory. Pointer values are very much like references in Java.

A pointer variable is a variable that contains a pointer value.

A pointer type in C is a datatype that can be used to declare a pointer variable.

Syntax:

> *X*&#x2A; is a pointer type, "pointer to *X*"

Example: the type "pointer to **int**" is

> **int**&#x2A;

To declare a variable **p** as a pointer to **int**:

```c
int *p;
```

We can get a pointer value specifying the address of any variable by using **&**, the *address-of* operator. For example:

```c
int x = 17;
printf("%i\n", x); // prints 17

int *p;
p = &x;  // assign the address of x to p

*p = 42;
printf("%i\n", x); // prints 42
```

We can retrieve the value stored in the memory location to which a pointer points using **&#x2A;**, the *dereference* operator.

```c
int x = 17;
int *p;
p = &x;
printf("%i\n", *p); // prints 17
```

Pointer/Array Duality
---------------------

In many contexts, C treats the types "array of *X*" and "pointer to *X*" interchangeably. Consider the variable declaration

```c
int *p;
```

which declares the variable **p** to have type "pointer to **int**". We can treat **p** as pointing to a single **int** variable, or as pointing to an array of **int** variables.

Example:

```c
int a[3] = {7, 8, 9};

int *p = &a[0]; // p points to the first element of a

printf("%i\n", *p);   // prints 7
printf("%i\n", p[0]); // prints 7
printf("%i\n", p[1]); // prints 8
printf("%i\n", p[2]); // prints 9
```

Dynamic memory allocation, arrays
=================================

*Dynamic memory allocation* is the allocation of a chunk of memory of a specified size. The **malloc** function performs dynamic memory allocation in C. The function call

> **malloc**(*numBytes*)

allocates a chunk of memory of size *numBytes*, and returns a pointer to it. You can think of **malloc** as being like the **new** operator in Java and C++.

Pointer/array duality is often used to allow the allocation of arrays with an arbitrary number of elements. For example, let's say that we have an integer variable **n**, and we need an array of **n** **double** elements. We can use **malloc** to allocate the array, and a variable of type "pointer to **double**" to refer to it:

```c
double *arr = malloc(n * sizeof(double));
```

The **sizeof** operator computes the number of bytes required to store a single instance of a given datatype, so **sizeof(double)** yields the number of bytes needed to store a single **double** value.

Note that **malloc** returns a "generic" pointer value that is safe to assign to a variable declared as any pointer type. So, we could use **malloc** to create a pointer of **double** elements, **int** elements, etc.

Freeing dynamically allocated memory
------------------------------------

Unlike Java, C does not use garbage collection to automatically reclaim unused dynamically-allocated memory. Your program must manually free such memory when it is no longer needed, using the **free** function:

```c
free(arr);
```

This would free the chunk of memory to which the variable **arr** points.

Pointers and structs
====================

Instances of structs are often allocated dynamically. For example:

```c
struct Coord {
    float x, y, x;
};

...

struct Coord *c;
c = malloc(sizeof(struct Coord));
```

In this example, the variable **c** points to a dynamically-allocated instance of the **Coord** struct.

In theory, we could use the dereference operator (**&#x2A;**) and the member selection operator (**.**) together to access the fields of a struct via a pointer:

```c
(*c).x = 12.4;
```

The parentheses are needed because the member selection operator has higher precedence than the dereference operator.

Because access fields of struct instances through pointers is so important in C, there is a special operator to do it: the arrow, **-\>**. So, the code above could be written as

```c
c->x = 12.4;
```

You should always use the arrow operator to access fields of a struct instance through a pointer.

"Object-Oriented" C
-------------------

Complex C programs are often "object-oriented": they represent information as instances of struct types, and access those instances via pointers. To draw an analogy with Java:

> class = struct type
>
> object = instance of struct type
>
> reference variable = pointer variable

Because a C struct type can't contain functions (methods), instead each C struct type will have functions that take a pointer to an instance of that struct type as the first parameter: these functions are essentially methods.

Example datatype
----------------

Example: **Grid** datatype from assignment 1. In the header file:

```c
typedef struct {
    int rows;
    int cols;
    // TODO: add other fields
} Grid;
```

Here, we are declaring a datatype called **Grid**. "typedef" is used so that this type can be referred to as **Grid** instead of **struct Grid**.

An instance of **Grid** represents a two-dimensional grid of **uint8\_t** values: see assignment 1 for details.

The **Grid** datatype has functions that create, destroy, and do operations on instances of **Grid**:

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

Aside from **grid\_alloc**, which creates an instance of **Grid** and returns a pointer to it, each function takes a pointer to a **Grid** instance as its first parameter.
