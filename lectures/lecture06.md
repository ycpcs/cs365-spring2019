---
layout: default
title: "Lecture 6: MPI Derived Datatypes"
---

MPI Derived Datatypes
=====================

One important factor influencing the performance of an MPI program is how many messages it sends. In general, sending fewer messages is better, since each message incurs some overhead, and fewer messages results in less overhead.

MPI offers a variety of ways to define new *datatypes* for messages. By defining a new datatype, your program can potentially send a single message that would have required multiple messages to send using the built-in datatypes.

Example: let's say you have a grid datatype where the underlying representation of the grid is a one-dimensional array, and the grid elements are stored in row-major order.

Sending a complete (or partial) *row* of data using this grid representation requires only a single message, since elements in the same row are guaranteed to be contiguous in memory, and we can take advantage of the capability of **MPI\_Send** and **MPI\_Recv** to send and receive arrays of elements in a single message.

Sending a complete (or partial) *column* of data, on the other hand, would require one message per element, because the elements in a column are *not* contiguous. However, the elements in a single column are regularly-spaced: by adding the number of columns to the index of an element, we obtain the index of the next element in the same column.

For example: let's say we have defined a **send\_col** function to send an arbitrary column of values (except for top and bottom padding values) to another process. Here is how we might define that function using one call to **MPI\_Send** per element:

    static void send_col(Grid *g, int col, int dest) {
        for (int j = 1; j < g->rows - 1; j++) {
            uint8_t cell = grid_get_current(g, j, col);
            MPI_Send(&cell, 1, MPI_CHAR, dest, 0, MPI_COMM_WORLD);
        }
    }

Here is the corresponding **recv\_col** function:

    static void recv_col(Grid *g, int col, int src) {
        for (int j = 1; j < g->rows - 1; j++) {
            uint8_t cell;
            MPI_Recv(&cell, 1, MPI_CHAR, src, 0, MPI_COMM_WORLD, NULL);
            grid_set_current(g, j, col, cell);
        }
    }

Our program will be more efficient if we can find a way to reduce the number of messages sent and received per column.

MPI\_Type\_vector
-----------------

The **MPI\_Type\_vector** function allows your program to define a datatype for sending and receiving regularly spaced data: this is known as a *vector* or *strided* datatype. Its syntax:

Explanation of parameters:

-   *numblocks* is how many distinct groups of elements will be sent
-   *blocksize* is how many elements are in each block
-   *stride* is the distance (counted in number of elements) between the beginning of each block
-   *oldtype* is the datatype of the elements
-   *newtype* is a pointer to an **MPI\_Datatype** variable in which the new datatype is stored

Following a call to **MPI\_Type\_vector** to create a new strided datatype, the **MPI\_Type\_commit** function must be called before the new datatype is used in communication.

Let's say that each processor's local grid has **local\_nrows+2** rows and **local\_ncols+2** columns. (The +2 is to account for a padding row and column on each side, for data values computed by other processes.)

We could use the following calls to create a new strided datatype to send/receive an entire column of values (leaving out the top and bottom padding values):

    MPI_Type_vector(local_nrows, 1, local_ncols+2, MPI_CHAR, &s_coltype);
    MPI_Type_commit(&s_coltype);

Note that **s\_coltype** is a (static) variable whose type is **MPI\_Datatype**:

    static MPI_Datatype s_coltype;

Now, the **send\_col** and **recv\_col** functions can be implemented using a single call to **MPI\_Send**/**MPI\_Recv**:

    static void send_col(Grid *g, int col, int dest) {
        MPI_Send(g->buf1 + (1*g->cols) + col, 1, s_coltype, dest, 0, MPI_COMM_WORLD);
    }

    static void recv_col(Grid *g, int col, int src) {
        MPI_Recv(g->buf1 + (1*g->cols) + col, 1, s_coltype, src, 0, MPI_COMM_WORLD, NULL);
    }

Note that some pointer arithmetic is required to find the address of the first element to be sent or received as part of the column.

MPI\_Type\_struct
-----------------

The **MPI\_Type\_struct** function can be used to define a datatype that is a composite of existing datatypes: for example, to descibe a C struct datatype.

Discussion question: Is **MPI\_Type\_struct** necessary? (Hint: not really.)  Why does it exist?
