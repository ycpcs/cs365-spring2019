---
layout: default
title: "Lecture 15: Socket programming in C"
---

# Unix I/O, Sockets

Demo programs:

> [socket.zip](socket.zip)

## TCP/IP Socket programming

Sockets &mdash; the Unix standard API for network I/O

> Windows has something almost identical, called "winsock"

## File descriptors

A file descriptor is an integer value naming an underlying open file resource.

File descriptors are used in all Unix system calls which do I/O, or other operations on files/streams.

### read and write

`read` &mdash; read data from a file/stream named by a file descriptor into a buffer

{% highlight cpp %}
ssize_t read(int fd, void *buf, size_t count);
{% endhighlight %}

`write` &mdash; write data from a buffer to a file/stream named by a file descriptor

{% highlight cpp %}
ssize_t write(int fd, const void *buf, size_t count);
{% endhighlight %}

See the `write_to_file.c` demo program.

### fdopen

`read` and `write` are a pain. For example, no formatted input/output.

Solution: convert a file descriptor into a FILE \* using the fdopen() function.  Then, use standard I/O functions such as `fprintf`, `fgets`, and `fscanf` to do I/O

Note that attempting to use a single FILE\* to read from and write to a socket will not necessarily work.  (TODO: figure out why!)  A work-around is to use the `dup` system call to duplicate the socket file descriptor, and then make two calls to `fdopen` to create file handles for reading an writing:

{% highlight c %}
int fd = /* a socket file descriptor from accept or connect */
int fd_copy = dup(fd);

FILE *read_fh = fdopen(fd, "r");
FILE *write_fh = fdopen(fd_copy, "w");
{% endhighlight %}

## Unix man pages

The Unix `man` command shows Unix manual pages.  These are extremely useful for getting quick reference documentation on system calls and C library functions.

Unix system calls (such as `read` and `write`) are documented in section 2 of the manual, and standard C library functions (such as `fdopen`) are documented in section 3 of the manual.

Some example commands to try:

    man 2 open
    man 2 read
    man 2 write
    man 3 fdopen

## Sockets

A socket is a *communications endpoint*.

Datagram socket: Can send/receive *datagrams* &mdash; discrete chunks of data. Analogy: mailbox.

Stream socket: is one end of a *connection*. A connection is a private communication channel between two communicating processes. Analogy: telephone.

Important concepts:

> Address &mdash; uniquely identifies a *host* on a network
>
> Port &mdash; distinguishes sockets on the same host from each other.

At the time the socket API was created (at UC Berkeley in the early 1980s), a variety of network protocol stacks were in active use, such as

-   TCP/IP
-   DECNET
-   others?

For this reason, the socket API treats socket addresses as an opaque data type, with multiple address types as "subclasses".

`sockaddr_un` &mdash; a union of all available socket types

For TCP/IP, you will use the `sockaddr_in` address type.

## Socket API

The socket API is implemented in a number of system calls.

`socket` &mdash; create a socket

{% highlight cpp %}
int socket(int domain, int type, int protocol);
{% endhighlight %}

* domain &mdash; what protocol family the socket will use. PF\_INET for TCP/IP
* type &mdash; SOCK\_STREAM for stream, SOCK\_DGRAM for datagram
* protocol &mdash; identifies a particular protocol to use, if not uniquely determined by type. Just use 0 for any TCP/IP socket.

The `socket` system call is typically used to create a *server socket*, which allows a process to accept incoming connections.

`listen` &mdash; wait for incoming connections

{% highlight cpp %}
int listen(int sockfd, int backlog);
{% endhighlight %}

* sockfd &mdash; the server socket on which to listen for incoming connections
* backlog &mdash; maximum number of incoming connections which will be queued

The return value is 0 if a connection has been received, or -1 if an error occurred.

`accept` &mdash; accept an incoming connection

{% highlight cpp %}
int accept(int sockfd, struct sockaddr *addr, socklen_t *addrlen);
{% endhighlight %}

* sockfd &mdash; the server socket file descriptor
* addr &mdash; a pointer to a `sockaddr` struct (really, a "subclass" of `sockaddr`) where the client's network address will be stored
* addrlen &ndash; pointer to a variable containing the size in bytes of the struct that addr points to; will be modified to store the actual address size

The return value is a file descriptor naming a socket connected to a two-way communications channel to the client.

`connect` &mdash; connect to a server

{% highlight cpp %}
int connect(int sockfd, const struct sockaddr *addr, socklen_t addrlen);
{% endhighlight %}

Connects to a remote process.  This is the system call that a client process uses to connect to establish a connection to a server process.

## Concurrency issues

Once a process is listening on a server socket, any number of clients may request connections.  If the server handles the connections in a strictly one at a time manner, then undesirable behavior results: only one client will be able to connect at a time.

Threads are one possible solution: the server can create a thread to handle each new connection, allowing multiple connections to be handled simultaneously.  This is an application of threads where *concurrency* is the motivation, rather than *parallelism* (although parellelism is often desirable in server applications as well.)

One somewhat difficult issue that arises in server applications is how to handle blocking operations, mainly I/O operations such as `accept`.  For example, we might want a mechanism to allow the server to shut itself down cleanly.  However, if the server is "stuck" in a blocking call to `accept` (or other blocking system call), then it may be difficult to gracefully "unstick" the thread that is suspended in the blocking system call.  One possible solution is to use *nonblocking* I/O.  A file descriptor, including a server socket, can be marked as nonblocking using the `fcntl` system call.  The `select` system call allows a calling thread to do a timed wait until either a file descriptor becomes "ready" (e.g., an incoming connection is available on a server socket), or a timeout expires.  Because nonblocking I/O avoids any operations that would block indefinitely, it allows the program to check for situations such as a shutdown request.

## Example programs

* write\_to\_file.c &mdash; open a file and write to it using Unix system calls
* server.c &mdash; a simple server program implemented using Unix system calls for I/O
* server2.c &mdash; similar to server.c, but using `fdopen` and standard I/O functions
* server3.c &mdash; a server that does two-way communication with clients, by reading lines and sending them back: use the `telnet` program as a client
* server4.c &mdash; like server3.c, but uses threads to support multiple concurrent connections
* client.c &mdash; a simple client program (which connects to the server implemented by server.c and server2.c), using Unit system calls for I/O
* client2.c &mdash; similar to client.c, but using `fdopen` and standard I/O functions
