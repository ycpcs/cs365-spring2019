---
layout: default
title: "Lecture 18: CUDA Threads"
---

Updated CUDA example code: [cudaHello2.zip](cudaHello2.zip)

# Using CUDA Threads

To fully exploit GPU hardware using CUDA, it is necessary to use CUDA threads.

The good news is that CUDA threads are not like CPU threads (e.g., pthreads or Java threads).  Threads appear in the CUDA programming model as an additional index or indices, similar to the block index/indices, that your kernel function will use to determine its assignment in the overall computation.

The basic idea is very simple: in specifying the parallel blocks to be executed, either as an integer or as multiple dimensions, you can also specify the number of threads per block.  The number of threads can be specified as an integer, or as multiple dimensions (using the `dim3` data type, in the same way that multiple dimensions can be specified for parallel blocks.)

## Example: Mandelbrot set

In our [original CUDA example code](cudaHello.zip), we used one thread per parallel block.  In the revised example code ([cudaHello2.zip](cudaHello2.zip)), we define a constant (`THREADS_PER_BLOCK`) to specify a fixed number of threads per block.  The number of threads per block should be a multiple of 32 in order to use hardware resources efficiently.

Because each block will now execute the kernel function using multiple threads, we reduce the number of rows of parallel blocks:

{% highlight cpp %}
int num_blocks_y = DIM / THREADS_PER_BLOCK; // determine how many rows per block
if (DIM % THREADS_PER_BLOCK > 0) {
	// Number of rows did not divide evenly by number of threads:
	// add one additional block.  The kernel function will
	// check to make sure that the block index and the thread
	// index yield a valid row.
	num_blocks_y++;
}
dim3 grid(DIM, num_blocks_y);
kernel<<<grid, THREADS_PER_BLOCK>>>( dev_data );
{% endhighlight %}

Note that because the problem size (in one or more dimensions) might not divide evenly by the number of threads, it may be necessary to schedule additional blocks.

Here is the modified kernel function:

{% highlight cpp %}
__global__ void kernel( int *data )
{
	int i = blockIdx.x;
	int j = blockIdx.y*blockDim.x + threadIdx.x;

	// If the number of rows (DIM) did not divide evenly by the
	// number of threads, then the last "row" of blocks will
	// have some excess threads that won't be assigned to
	// actual rows of the computation.  The if statement checks
	// to make sure that the grid row index (j) is valid
	// before doing the computation.

	if (j < DIM) {
		float x = -2.0f + (((float)i / DIM) * 4.0f);
		float y = -2.0f + (((float)j / DIM) * 4.0f);

		int iters = cuMandelIters( cuComplexMake( x, y ) );

		data[j * DIM + i ] = iters;
	}
}
{% endhighlight %}

Note that `blockDim.x` gives us the total number of threads per block, and `threadIdx.x` gives us the current thread number (in the range 0..`blockDim.x`-1, inclusive).  In the kernel function, we use this information to compute the row number in the computation.

Using 32 threads per block, the running time of the computation decreases from 472.6 ms to 7.2 ms.  Using 64 threads per block, the running time is about 6.4 ms.

<!-- vim:set wrap: ­-->
<!-- vim:set linebreak: -->
<!-- vim:set nolist: -->
