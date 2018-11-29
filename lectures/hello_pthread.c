#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

typedef struct {
	// data describing this thread's subproblem
	int value;

	// data that is the result of this thread's computation
	int result;
} Work;

// thread start function
void *worker(void *arg) {
	Work *work = arg;

	printf("My data is %i\n", work->value);

	// compute a result
	work->result = work->value * 2;

	return NULL;
}

#define NUM_THREADS 4

int main(void) {
	Work *work_data = malloc(sizeof(Work) * NUM_THREADS);

	// assign work
	work_data[0].value = 1;
	work_data[1].value = 2;
	work_data[2].value = 3;
	work_data[3].value = 4;

	printf("About to create threads...\n");

	// create threads
	pthread_t threads[NUM_THREADS];
	for (int i = 0; i < NUM_THREADS; i++) {
		pthread_create(&threads[i], NULL, &worker, &work_data[i]);
	}

	printf("Waiting for threads...\n");

	// wait for threads to finish
	for (int i = 0; i < NUM_THREADS; i++) {
		pthread_join(threads[i], NULL);
	}

	printf("Threads are finished\n");
	for (int i = 0; i < NUM_THREADS; i++) {
		printf("Result: %i\n", work_data[i].result);
	}

	return 0;
}
