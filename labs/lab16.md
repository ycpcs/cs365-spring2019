---
layout: default
title: "Lab 16: CUDA Threads"
---

# Getting Started

This lab is a continuation of [Lab 15](../labs/lab15.html).

You will need to log into `deepthought` to use the CUDA development tools and run CUDA programs:

    ssh deepthought

# Your Task

Use threads to increase the speed of the image transformation algorithms you implemented in Lab 15.

## Calling a kernel function with multiple threads

You can specify a number of threads when you call your kernel function. For example, rather than calling the kernel using a single thread per parallel block:

    cuBlur<<<grid, 1>>>( dev_imgdata, dev_imgdata_out, w, h );

Call the kernel using multiple threads per block:

    cuBlur<<<grid, 128>>>( dev_imgdata, dev_imgdata_out, w, h );

The above call will create 128 threads per parallel block.

**Important**: Because each parallel block will execute multiple threads, you will (generally) need to allocate at least as many pixels as threads to each block. Your original version of the program (from Lab 15) most likely assigned one block per pixel.

Your kernel function can find its thread id in the `threadIdx.x` variable. If you use a two-dimensional grid of threads per parallel block (rather than a single integer number of threads), then you can also use `threadIdx.y`.

Your kernel function can use `blockDim.x` and `blockDim.y` to find the number of columns and rows in each block.

**Suggestion**: Using 128x1 or 128x128 threads per block seems to produce good speedups (about 25x) compared to the previous version of the program that did not use threads and allocated one pixel to each block.

Performance measurement
-----------------------

For each of the two transformations (blur and emboss), measure the performance of the single-threaded and multithreaded kernel functions using the following C function:

    unsigned long utime(void)
    {
        struct timeval tv;
        unsigned long result = 0;

        gettimeofday(&tv, NULL);
        result += (tv.tv_sec * 1000000);
        result += tv.tv_usec;

        return result;
    }

Note that you will need to add

    #include <sys/time.h>

to the top of `transformImage.cu`. You can measure elapsed time in microseconds as follows:

<pre>
unsigned long begin = utime();
<i>...copy host buffer to device buffer...</i>
<i>...call kernel function...</i>
<i>...copy device buffer to host buffer...</i>
unsigned long end = utime();

unsigned elapsed = end - begin;
printf("%lu microseconds\n", elapsed);
</pre>

Compare the times for the non-threaded and threaded kernels. Did you see a speedup? If so, how much?  What number of threads gave you the best speedup?
