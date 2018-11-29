---
layout: default
title: "Lab 14: Network Arithmetic Server (Java version)"
---

# Getting Started

Download [CS365\_Lab14.zip](CS365_Lab14.zip) and unzip it.

You can import it into Eclipse, or unzip on the command line.

Building from the command line:

    ant

Running from the command line:

<pre>
./run.sh Server <i>port</i>
</pre>

# Your Task

Implement a server that

-   listens on a TCP port and accepts connections
-   reads a single line of text from each connection
-   parses the received text to extract two integer values
-   computes the sum of the integer values
-   sends a single line of text containing the sum back to the client
-   closes the connection socket

You can use the socket example programs from [Lecture 16](../lectures/lecture16.html) as a reference.

# Hints

You can implement this server as a "one shot" protocol" where the server reads a single request, sends back a single response, and then closes the connection.

If you have additional time, you can consider adding the following features:

* Allow the client to submit multiple requests, one per line, and have the server send back as many responses as necessary
* Use threads to allow multiple clients to connect simultaneously

# Testing

You can use the **telnet** program to test the server. For example, if the server is listening on port 10001, then run the command

    telnet localhost 10001

to connect to the server. You can type a line of text containing the two numbers to be added. You should see a response containing their sum.
