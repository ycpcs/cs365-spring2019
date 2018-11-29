---
layout: default
title: "Lecture 16: Socket programming in Java"
---

Example code: [JavaSockets.zip](JavaSockets.zip)

This code is an Eclipse project, and you can also build and run from the command line.  To build, run the command `ant`.  To run one of the example programs, use one of the following commands:

<pre>
./run.sh Server <i>port</i>
./run.sh Client <i>hostname</i> <i>port</i> <i>message</i>
./run.sh Server2 <i>port</i>
</pre>

Note that you'll need to make <code>run.sh</code> executable:

<pre>
chmod a+x run.sh
</pre>

# Socket programming in Java

Socket programming Java is much easier than in C.

## Basic socket programming

`java.net.ServerSocket` &mdash; a server socket which may be used to accept connections.  Usually, the constructor is passed a port number.  Optionally, you can specify a specific network to listen on (along with the port) if you only want to accept connections from particular networks.  Call the `accept()` method to wait for an incoming connection (which is returned as a `Socket`, see below).

`java.net.Socket` &mdash; a general two-way communication socket.  Call the `getInputStream()` and `getOutputStream()` methods to get `InputStream` and `OutputStream` objects receiving data from and sending data to the remote process.  A connection to a remote server can be established by passing a hostname and port number to the constructor.

Example programs:

* `Server` &mdash; accepts connections from clients, reads a single line of text, sends the line of text back to the client, and closes the connection.  Does not use threads, so only one client connection can be active at a time.
* `Client` &mdash; connects to a server, sends one line of text, and then reads a one-line response.

## Concurrency issues

The concurrency issues with Java sockets are similar to the ones for programming with C sockets.

One basic issue is that if the server is single-threaded in the obvious way, only one client at a time can connect.  A straightforward solution to this problem is to use threads, such that each client connection is handled by a single thread.

Another important issue is that the `accept()` method of `ServerSocket` is a blocking method, and will suspend the calling thread indefinitely if there are no incoming client connection requests.  This can make it difficult for the server to shut down gracefully.  The solution to this problem is similar to C: make the server socket nonblocking, and use a timed wait to accept incoming connections, giving the server process opportunities to do other processing (such as checking whether a shutdown was requested) at regular intervals.

Nonblocking I/O and timed waits in Java require the use of the `java.nio` framework, often referred to as simply "nio".  The essential abstraction in nio is the "channel", which you can think of as being equivalent to a file descriptor: it names an I/O resource such as an input stream, output stream, socket, or server socket.

`java.nio.channels.ServerSocketChannel` &mdash; A channel class which is the nio equivalent of `java.net.ServerSocket`.  Created with a call to `ServerSocketChannel.open()`.  It must be bound to an address and port using by calling the `bind` method.  The `configureBlocking` method can be used to set the server socket to nonblocking.

`java.nio.channels.SocketChannel` &mdash; A channel which refers to a two-way communications socket.  You can call the `sock()` method to get a reference to the underlying `java.net.Socket` object.

`java.nio.channels.Selector` &mdash; A set of `SelectionKey`s, where each `SelectionKey` monitors one channel (such as a `ServerSocketChannel`).  Allows the program to wait for one or more channels to become ready, such as a server socket channel becoming ready to accept a connection.  Is analogous to `fd_set` in C.  Call the `select` method to wait for one or more channels to become ready: a timeout argument may be provided to cause `select` to return if no activity occurs before the timeout.

`java.nio.channel.SelectionKey` &mdash; An object that represents the status of a monitored channel.  When the `select` method of a `Selector` returns, the program can iterate through the set of `SelectionKey`s that are ready for I/O.  Note that keys must be removed from the `Selector`'s ready set, otherwise they may appear to be ready even if they aren't.

Example program:

* `Server2` &mdash; Multithreaded server implementation that reads a series of lines of text from clients, and echoes them back until the client sends `quit` or `shutdown`.  Use the `telnet` program as the client.  Uses nonblocking I/O to allow a graceful shutdown when a client requests a shutdown.  Interesting details to note: a volatile boolean field indicating whether any client has requested a shutdown, and an `AtomicInteger` object to keep track of how many worker threads are active (to avoid shutting down while communications with clients are ongoing.)
