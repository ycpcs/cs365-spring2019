---
layout: default
title: "Lecture 2: Intro to Parallel Computation"
---

Flynn's Taxonomy
================

Flynn's taxonomy categorizes computer architectures according to type of parallelism they exhibit.

SISD
----

SISD = "Single Instruction, Single Data"

This is a conventional sequential computer: there is a single stream of instructions executing, and each instruction produces a single data value (from a fixed number of operands.)

Vector Architectures
--------------------

In a vector architecture, special vector instructions can produce many data values in parallel. For example, consider the following code:

```c
for (int i = 0; i < 100; i++) {
    result[i] = a[i] * b[i];
}
```

On a SISD machine, the instruction in the loop body would need to execute 100 times, in sequence. On a vector machine with a vector-multiply instruction, a single instruction could multiply many/all of the input operands, storing the resulting products in elements of the destination array. Note that it is not necessarily the case that all of the multiplications would happen simultaneously, but they would complete more quickly than if executed sequentially.

Note that modern general purpose CPUs often support vector instructions.

Vector instructions are useful for certain applications (especially scientific applications), but they do not constitute a general form of parallelism.

SIMD
----

SIMD = "Single Instruction, Multiple Data"

SIMD architectures are like vector architectures, in the sense that a single instruction can cause computation on many data in parallel. However, full SIMD is more general. In SIMD, when a parallel instruction is executed, an single arbitrary sequence of operations is performed by each parallel execution unit. In other words, rather than being limited to a fixed set of dedicated vector instructions, a SIMD processor allows arbitrary computations to be performed in parallel on an array of data.

MIMD
----

MIMD - "Multiple Instruction, Multiple Data"

A MIMD architecture exhibits fully-general parallelism: each processor executes its own stream of instructions, on arbitrary data, independently of other processors.

There are two main forms of MIMD architectures:

-   *Shared-memory*: all processors are connected to a common memory system. So, each stream of instructions can access and modify common data structures.
-   *Distributed memory*: each processor has its own local memory. A processor either cannot directly access another processor's memory, or can access another processor's memory only through special (slow) instructions.

### Shared Memory MIMD

A system with multiple CPUs, and/or multiple CPU cores per physical CPU, is a shared memory MIMD machine.

One of the primary issues in designing a shared-memory machine is how to connect the CPUs (and/or CPU cores) to the shared memory. The goal is to avoid having the shared memory system become a bottleneck: if possible, multiple cores should be able to access separate data in parallel.

> Example: single memory bank accessed through bus vs. multiple memory banks accessed through crossbar.

Another issue is *cache coherence*: For good performance, each CPU must use a cache to provide quick access to recently-used data. (Loads from and stores to RAM are very slow compared to CPU speeds.) However, an issue arises when multiple CPUs have the same memory location in their caches at the same time. If one CPU modifies the value, this change must become visible to the other CPUs.

Possible approaches:

-   *bus snooping*: each processor monitors shared bus for writes to memory locations in its own cache, invalidating the entry in its cache (if any) for the modified memory location.
-   *bus snarfing*: like bus snooping, but each processor also monitors the data bus, updating (not invalidating) its own cache entry with the modified data.
-   *directory-based*: a central directory keeps track of the contents of each processor. Writes to a memory location can thus update all caches which have the location cached.

Shared-memory machines are difficult to scale to large numbers (thousands) of CPUs.

### Distributed-memory MIMD

Distributed memory architectures can scale more easily: each processor (and its local memory) is connected to a communcation network.

Processors communicate by sending *messages* to each other over a network.

All kinds of network topologies have been tried. (See book for details.)

Approaches:

-   Small networks (up to 40? nodes): Star topology, connected via switch (ideally, full crossbar.) Every CPU is directly connected to every other.
-   Larger networks: Computers are directly connected to 1 or more peers. Directly-connected peers can communicate quickly. Indirectly-connected peers must communicate via forwarding by intermediate nodes. Common topologies: mesh, torus.

Key issue: topology of network must support the communication pattern that the intended application(s) will use. If the applications will require communication between indirectly-connected nodes, congestion in the network may negatively affect performance.

### Network technologies, Message-Passing Performance

Because communication is critical to the performance of message passing, the characteristics of the underlying network technology are very important.

Important features of a network technology:

-   *Bandwidth*: what is the maximum bulk data transfer rate of the network?
-   *Latency*: when a CPU sends to a message to a directly-connected peer, how much time elapses before the first bit of the message arrives?

Bandwidth is important because some applications may require large volumes of data be distributed to each CPU.

Latency is important because if CPUs need to communicate with each other frequently, the delays due to latency can become significant.

Comparison:

> Technology | Typical bandwidth | Typical latency
> ---------- | ----------------- | ---------------
> Ethernet | 1GB/s per link | 1.3 ms
> Infiniband | 8GB/s per link | 1.5 μs

Ethernet is useful for building low-cost clusters using commodity hardware. However, the bandwidth may not be adequate for applications with large volumes of data, and the latency can seriously degrade performance for applications with frequent communication operations.

Another issue with ethernet is that most ethernet switches have two important limitations:

-   They are *store-and-forward* devices. Sending of a packet on the outgoing link does not begin until the switch has received the entire packet on the incoming link. This hurts latency.
-   They typically do not allow full-bandwidth communications between multiple pairs of communicating nodes.

A high-performance network technology such as Infiniband can allow much better performance.

-   An Infiniband switch can allow about 40 nodes to be connected directly, allowing full bandwidth and minimum latency. Internally, the switch uses *cut-through routing* to ensure that outgoing data is transmitted with minimum delay (as soon as recipient address is decoded), and a crossbar architecture to allow full N-to-N simultaneous communication.

A high-performance network will be substantially more expensive. (An Infiniband switch can cost $40,000!)

> *Update, Jan 2016* &mdash; This no longer appears to be true: Infiniband switches now appear to be available in the low hundreds/thousands of dollars.
