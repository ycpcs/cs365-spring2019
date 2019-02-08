---
layout: default
title: "Setting up OpenMPI"
---

This page explains how to set up [OpenMPI](https://www.open-mpi.org/) development tools under Linux on your own computer.  This is a useful way to develop and test your MPI programs, and may be more convenient than using the Linux cluster.  Note that you should still use the Linux cluster for testing, since it supports true parallel execution with up to 56 MPI processes.

# Installing Linux

First you will need to install Linux.  If you are running Windows or MacOS, you can use [VirtualBox](https://www.virtualbox.org/) to run Linux in a virtual machine.

I recommend [Linux Mint](https://linuxmint.com/), [Ubuntu](https://www.ubuntu.com/), or [CentOS](https://www.centos.org/).  Personally, I favor Linux Mint (MATE edition), but any of these is fine.

# Installing the OpenMPI packages

On Linux Mint or Ubuntu, run the command:

```bash
sudo apt-get install libopenmpi-dev
```

On CentOS, run the commands:

```
su
yum install openmpi openmpi-devel
```

On CentOS, you should also add the following commands to the `.bashrc` file in your Linux home directory (you can use a text editor to edit this file):

```bash
if [ -z "$OPENMPI_ADDED" ]; then
    export PATH=/usr/lib64/openmpi/bin:$PATH
    export OPENMPI_ADDED=yes
fi
```

You should close your terminal and start a new terminal after modifying your `.bashrc`.

# Modifying `hostfile.txt`

In the MPI labs and assignment, there is a file called `hostfile.txt` which OpenMPI uses to determine which hosts (computers) are available to run MPI processes.  You can use the following commands to configure `hostfile.txt` for local development:

```bash
mv hostfile.txt ORIGhostfile.txt
echo "localhost slots=4 max-slots=4" > hostfile.txt
```

This will allow you to run your MPI programs with up to 4 processes.  Depending on your CPU and (if relevant) how you've configured your virtual machine software, the degree of parallelism you'll see could vary.  However, even without real parallelism, you will be able to test your program to see if the communication between processes works correctly, which is generally one of the challenging aspects of using MPI.

The file `ORIGhostfile.txt` is a backup of the original `hostfile.txt` which is configured to allow execution using up to 56 processes on the Linux cluster.
