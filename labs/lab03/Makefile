# CS 365 - Lab 3 Makefile

PROGS = integrate

CFLAGS = -Wall -std=gnu99 -D_REENTRANT -D_GNU_SOURCE
CC = mpicc

all : $(PROGS)

integrate : integrate.o
	$(CC) -o $@ integrate.o -lm

clean :
	rm -f *.o $(PROGS) *~
