package edu.ycp.cs365.rng;

public class Benchmark {
	// set to false to use lock-free implementation
	private static final boolean locking = true;
	
	private static final int MAX = 10000000; // 10 million
	private static final int NUM_THREADS = 4;
	
	static class Worker implements Runnable {
		private RandomNumberGenerator rng;
		private int sum;

		Worker(RandomNumberGenerator rng) { this.rng = rng; }
		
		@Override
		public void run() {
			for (int i = 0; i < MAX; i++) { sum += rng.nextInt(); }
		}
		
		public int getSum() { return sum; }
	}
	
	public static void main(String[] args) throws InterruptedException {
		RandomNumberGenerator rng = locking ? new LockBasedRNG() : new LockFreeRNG();
		
		long begin = System.currentTimeMillis();
		Worker[] workers = new Worker[NUM_THREADS];
		Thread[] threads = new Thread[NUM_THREADS];
		for (int i = 0; i < NUM_THREADS; i++) {
			workers[i] = new Worker(rng);
			threads[i] = new Thread(workers[i]);
			threads[i].start();
		}
		for (int i = 0; i < NUM_THREADS;i++) { threads[i].join(); }
		long end = System.currentTimeMillis();
		int result = 0;
		for (int i = 0; i < NUM_THREADS; i++) { result += workers[i].getSum(); }
		System.out.println("result="+result);
		System.out.println("Time=" + (end-begin));
	}
}
