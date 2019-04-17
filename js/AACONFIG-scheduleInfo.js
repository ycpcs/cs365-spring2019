// This file defines the class periods and final exam days.

courseInfo.classPeriods = [
	{
		topic: new Topic("Lecture 1: C Pointers and Dynamic Memory Allocation", "lectures/lecture01.html"),
		reading: "",
		lab: new Lab("No lab", "")
	},
	{
		topic: new Topic("Lecture 2: Intro to Parallel Computation", "lectures/lecture02.html"),
		reading: "Chapters 1-2",
		lab: new Lab("No lab", "")
	},
	{
		topic: new Topic("Lecture 3: MPI", "lectures/lecture03.html"),
		reading: "Sections 3.1-3.3 (p. 83–101)",
		lab: new NumberedLab(1, "Hello, MPI", "CS365_Lab01.zip")
	},
	{
		topic: new Topic("Lecture 4: Elements of a Parallel Program", "lectures/lecture04.html"),
		reading: "",
		lab: new NumberedLab(2, "One-dimensional cellular automaton", "CS365_Lab02.zip")
	},
	{
		topic: new Topic("Lecture 5: MPI Collective Communication", "lectures/lecture05.html"),
		reading: "Section 3.4 (p. 101–116)",
		lab: new NumberedLab(3, "MPI Collective Communication", "CS365_Lab03.zip")
	},
	{
		topic: new Topic("Lecture 6: MPI Derived Datatypes", "lectures/lecture06.html"),
		reading: "Section 3.5 (p. 116–119)",
		lab: new NumberedLab(4, "MPI Derived Datatypes", "CS365_Lab04.zip")
	},
	{
		topic: new Topic("Lecture 7: MPI Performance", ""),
		reading: "Section 3.6 (p. 119–127)",
		lab: new NumberedLab(5, "Message-passing performance", "CS365_Lab05.zip")
	},
	{
		topic: new Topic("MPI Review", ""),
		reading: "",
		lab: new Lab("No lab", "")
	},
	{
		topic: new Topic("** Snow day, class is canceled", "")
	},
	{
		topic: new Topic("** Exam 1", "")
	},
	{
		topic: new Topic("Lab activity / work day", "")
	},
	{
		topic: new Topic("Lecture 8: Introduction to pthreads", "lectures/lecture08.html"),
		reading: "",
		lab: new NumberedLab(6, "Pthreads", "CS365_Lab06.zip")
	},
	{
		topic: new Topic("Lecture 9: Mutexes", "lectures/lecture09.html"),
		reading: "Sections 4.1–4.6",
		lab: new NumberedLab(7, "Mutexes in pthreads", "CS365_Lab07.zip")
	},
	{
		topic: new Topic("Lecture 10: Condition variables", "lectures/lecture10.html"),
		reading: "Sections 4.7–4.8",
		lab: new NumberedLab(8, "Shared Queue", "CS365_Lab08.zip")
	},
	{
		topic: new Topic("Lecture 11: Reader/Writer Locks", "lectures/lecture11.html"),
		reading: "Sections 4.9–4.11",
		lab: new NumberedLab(9, "Reader/Writer Locks", "CS365_Lab09.zip")
	},
	{
		topic: new Topic("Lecture 12: Java Threads, Synchronization", "lectures/lecture12.html"),
		reading: "",
		lab: new NumberedLab(10, "Java Producer/Consumer Simulation", "CS365_Lab10.zip")
	},
	{
		topic: new Topic("Lecture 13: Fork/Join Parallelism", "lectures/lecture13.html"),
		//reading: "",
    reading: new LinkedReading("A Java Fork/Join Framework", "http://gee.cs.oswego.edu/dl/papers/fj.pdf", "Doug Lea"),
		lab: new NumberedLab(11, "Parallel Sorting using Fork/Join", "CS365_Lab11.zip")
	},
	{
		topic: new Topic("Lecture 14: Lock-free data structures", "lectures/lecture14.html"),
		//reading: "",
    reading: new LinkedReading("Simple, Fast, and Practical Non-Blocking and Blocking Concurrent Queue Algorithms",
                               "http://www.cs.rochester.edu/~scott/papers/1996_PODC_queues.pdf",
                               "Maged Michael and Michael Scott"),
		lab: new NumberedLab(12, "Lock-free random number generator", "CS365_Lab12.zip")
	},
	{
		topic: new Topic("** Exam 2", "")
	},
	{
		topic: new Topic("Lecture 15: Socket Programming in C", "lectures/lecture15.html"),
		reading: "",
		lab: new NumberedLab(13, "Network Arithmetic Server", "CS365_Lab13.zip")
	},
	{
		topic: new Topic("Lecture 16: Socket Programming in Java", "lectures/lecture16.html"),
		reading: "",
		lab: new NumberedLab(14, "Network Arithmetic Server (Java version)", "CS365_Lab14.zip")
	},
	{
		topic: new Topic("Lecture 17: GPGPU programming, CUDA", "lectures/lecture17.html"),
		reading: "",
		lab: new NumberedLab(15, "CUDA Image Processing", "CS365_Lab15.zip")
	},
	{
		topic: new Topic("Lecture 18: CUDA Threads", "lectures/lecture18.html"),
		reading: "",
		lab: new NumberedLabNoFile(16, "CUDA Threads")
	},


/*
	{
		topic: new Topic("", ""),
		reading: "",
		lab: new NumberedLab(2, "", "CS365_LabXX.zip")
	},
*/
];

// The following is for the college-scheduled final exam.
// It is not used if final is on last day of class"
courseInfo.finalExamDates = [
		new FinalExamDay("101", new Date("05/15/2019 15:00:00")),
];

// vim:ts=2:
