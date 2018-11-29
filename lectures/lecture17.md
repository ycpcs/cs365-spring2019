---
layout: default
title: "Lecture 17: GPGPU Programming, CUDA"
---

Example code: [cudaHello.zip](cudaHello.zip)

Note: CUDA is available by logging into the cluster host **bambleweeny**:

    ssh bambleweeny

GPU - Graphics Processing Unit
==============================

Designed for fast rendering of 3D graphics, but useful for general-purpose computation. ("GPGPU" computation means "General Purpose Graphics Processing Unit" computation.)

Graphics rendering is highly parallelizable, so GPUs have many cores.

CUDA
====

Language and runtime environment designed and implemented by nvidia for GPGPU computation.

The language is a dialect of C.

Important properties:

-   *SIMD style parallelism*. You define a "kernel" function, and the CUDA runtime executes it in parallel on different data values.
-   *Separate data memory spaces*. The "host" is the host CPU, and the "device" is a CUDA-capable GPU and its cores. Host and device code runs in separate memory spaces. A **cudaMemcpy** function can be used by the host to transfer data from device memory to host memory.
-   *Separate code spaces*. Aside from the special case of host code invoking a kernel function, host functions do not call device functions, and device functions do not call host functions. Note that it is fine for device functions to call each other.
-   *Floating-point limitations.* Some CUDA devices only support single precision (32 bit) floating point arithmetic. The devices that support double precision arithmetic do not necessarily implement it in a way that is compliant with IEEE 754.

Keywords:

-   `__global__` is used to mark a kernel function.
-   `__device__` is used to mark a device function.

Calling a kernel function:

<pre>
__global__ void kernel( <i>...params...</i> )
{
        <i>...code...</i>
}

...

void main( void )
{
        kernel&lt;&lt;&lt;par blocks, num threads per block&gt;&gt;&gt;( <i>...args...</i> );
}
</pre>

*par blocks* is a description of how many "blocks" (chunks of data) the kernel function will be called on. *num threads per block* specifies how many threads are executed (in parallel) per block.

*par blocks* can be a single integer N, in which case the kernel function is executed on N blocks. It can also be a two dimensional grid:

<pre>
dim3 grid( <i>xdim</i>, <i>ydim</i> );
</pre>

The above declaration defines a grid where the x dimension is in the range 0..*xdim* - 1 and the y dimension is in the range 0..*ydim* - 1. The kernel function is then invoked as

<pre>
kernel&lt;&lt;&lt;grid, 1&gt;&gt;&gt;( ...args... );
</pre>

Within the kernel function, the special **blockIdx** variable contains the information about which block the kernel is being executed on:

    blockIdx.x

is the x index of the block, and

    blockIdx.y

is the y index of the block (if the blocks are arranged in a two-dimensional grid.)

[Example: Mandelbrot set.]
