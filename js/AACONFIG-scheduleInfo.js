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
		reading: "Sections 3.1-3.3",
		lab: new NumberedLab(1, "Hello, MPI", "CS365_Lab01.zip")
	},
];

// The following is for the college-scheduled final exam.
// It is not used if final is on last day of class"
courseInfo.finalExamDates = [
		new FinalExamDay("101", new Date("05/15/2019 15:00:00")),
];

// vim:ts=2:
