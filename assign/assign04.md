---
layout: default
title: "Assignment 4: N-Body Simulation (GPU)"
---

Due: **Monday, April 29th** by 11:59 PM

# Getting Started

Download [CS365\_Assign04.zip](CS365_Assign04.zip). Unzip it on the cluster head node (or your local machine, if you are running Linux and have CUDA and `libui` installed).

If you are developing on the cluster, you will need to logged onto `bambleweeny`:

    ssh -X bambleweeny

To compile the sequential and parallel versions of the programs, run the command

    make

To run the programs:

    ./nbody_seq

    ./nbody_par

Note that the `nbody_par` program can take command line arguments:

* The `-p` argument specifies the number of bodies ("particles") to create
* The `-f` argument specifies the number of animation frames to display

For example, to run with 2000 bodies, displaying 200 animation frames, the command would be

    ./nbody_par -p 2000 -f 200

If you want to compile the program using Linux on your own computer, you will to build [libui](https://github.com/andlabs/libui).  You will also need to have CUDA installed.

# Your task

Your task is similar to the one in [Assignment 3](assign03.html): you will parallelize an N-Body simulation.

The difference is that in this version, you will use [CUDA](https://developer.nvidia.com/cuda-zone) to offload the computation onto the GPU.

You will make your code changes in `sim_par.cu`.

## Hints and specifications

Look at the **TODO** comments in `sim_par.cu`.  They indicate where you will need to add or modify code to execute the simulation on the GPU.

Note that the data representation has changed.  Rather than the main data structure being an array of `Particle` objects, the main data structure is now arrays called `x`, `y`, `dx`, `dy`, `mass`, and `color`.  A single particle is represented by the elements at a common index in these arrays.  See `particle.cu` and `sim_seq.cu` to see how the sequential computation works.

The `SimulationData` struct type is used to group pointers to all of the arrays into a single object.  The parallel computation (in `sim_par.cu`) will have *two* of these: one for the host (CPU), and one for the device (GPU).  Note that you must use `cudaMalloc` to allocate device buffers.

The `cudaMalloc` function is called as

```c
cudaMalloc((void**) &ptr, numBytes);
```

where `ptr` is a pointer variable where the address of the allocated device buffer should be stored, and `numBytes` is the number of bytes to allocate.  In the context of the assignment, one of your calls might look something like

```c
cudaMalloc((void**) &sim->pd_dev.x, sizeof(float) * sim->num_particles);
```

You will need to use the `cudaMemcpy` function to copy data between the host and device buffers.  Specifically:

* Data used by the kernel function must be copied from the host buffers to the device buffers before the kernel call
* Data produced by the kernel function must be copied from the device buffers to the host buffers after the kernel call

Your kernel function should take pointers to the 5 arrays `x`, `y`, `dx`, `dy`, and `mass`.  It will also need to know how many particles (bodies) are being simulated.  Your kernel function call should look something like the following:

```c
kernel<<<grid, THREADS_PER_BLOCK>>>(sim->pd_dev.x,
                                    sim->pd_dev.y,
                                    sim->pd_dev.dx,
                                    sim->pd_dev.dy,
                                    sim->pd_dev.mass,
                                    sim->num_particles);
```

Note that the `grid` parameter is a variable of type `dim3`.  It is possible to have a one-dimensional grid, e.g.

```c
dim3 grid(num_particles);
```

If you use a one-dimensional grid, only `threadIdx.x` (and not `threadIdx.y`) will vary in the calls to your kernel function.

Note that the functions `particle_dist`, `particle_force`, and `particle_compute_attraction` are defined to be available on *both* the CPU and GPU.  So, your kernel and device functions can call these functions as required to do the computation.

# Deliverables

There are two deliverables: a report and the code.

The report should be a text file that indicates how many particles (bodies) you were able to simulate without missing significant numbers of animation frames.  (Consider "significant" to mean 5 or more frames.)  The report should *also* estimate how much greater the throughput of your CUDA program is than the threaded program you implemented in [Assignment 3](assign03.html).  Note that the complexity of the computation grows with the *square* of the number of bodies being simulated.

Include the report in a text file called `report.txt` in your assignment submission.

# Grading

The grading is broken down as follows:

* `sim_create` (allocate device buffers, etc.): 10%
* `sim_destroy` (deallocate device buffers): 10%
* `sim_tick` data transfer: 10%
* `sim_tick` kernel function call: 10%
* Kernel function, computation: 50%
* Report: 10%

# Submitting

Run the command

    make submit

Type your Marmoset username and password when prompted.

**Important**: After submitting your work, log into the Marmoset server (<https://cs.ycp.edu/marmoset>) and check your submitted code to make sure it is what you intended to submit.  *It is your responsibility to ensure that your work is submitted correctly.*

<!-- vim:set wrap: -->
<!-- vim:set linebreak: -->
<!-- vim:set nolist: -->
