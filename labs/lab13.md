---
layout: default
title: "Lab 13: Network Arithmetic Server"
---

# Getting Started

Download [CS365\_Lab13.zip](CS365_Lab13.zip) and unzip it.

You will edit the code in `arithmetic_server.c`.

# Your Task

Write a server that

-   listens on a TCP port and accepts connections
-   reads a single line of text from each connection
-   parses the received text to extract two integer values
-   computes the sum of the integer values
-   sends a single line of text containing the sum back to the client
-   closes the connection socket

You can use the socket example programs from [Lecture 15](../lectures/lecture15.html) as a reference.

# Hints

* Use `dup` to duplicate the client socket file descriptor
* Use `fdopen` to convert the client socket into two FILE\* file handles, one for reading, one for writing
* Use `fscanf` to read two integer values from the client file handle (reading from the read file handle)
* Use `fprintf` to send the result value back to the client (writing to the write file handle)

You can implement this server as a "one shot" protocol" where the server reads a single request, sends back a single response, and then closes the connection.

If you have additional time, you can consider adding the following features:

* Allow the client to submit multiple requests, one per line, and have the server send back as many responses as necessary
* Use threads to allow multiple clients to connect simultaneously

# Testing

You can use the **telnet** program to test the server. For example, if the server is listening on port 10001, then run the command

    telnet localhost 10001

to connect to the server. You can type a line of text containing the two numbers to be added. You should see a response containing their sum.
