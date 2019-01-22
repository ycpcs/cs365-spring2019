---
layout: default
title: "Syllabus"
---

# CS 365 - Parallel and Distributed Computing

**Spring 2019**

Class time: M/W, 3:00&ndash;4:15 PM, CEC 104

Instructor: [David Hovemeyer](http://faculty.ycp.edu/~dhovemey/), <dhovemey@ycp.edu>, KEC 101<br>Office hours: M 9-11, T 1-2, W 11-12, Th 1-2, or by arrangement

Course Description
------------------

This course explores the theory and practice of designing and implementing programs to run on multiple processors in parallel. A number of programming projects using C/C++ with the pthreads and MPI libraries will provide an opportunity to implement and benchmark parallel programs. Additional topics may include OpenMP, fork/join frameworks, Java threads, GPU computation, lock-free and optimistic concurrency, distributed object frameworks, and general network communication using sockets.

Prerequisites
-------------

CS 350

Textbook
--------

Peter Pacheco, [An Introduction to Parallel Programming](http://www.cs.usfca.edu/~peter/ipp/index.html)

Course Structure and Expectations
---------------------------------

This main goal for this course is to introduce the theory and practice of designing and implementing parallel programs. A parallel program executes on multiple processors or computers simultaneously. For problems that are amenable to parallelization, a parallel program can complete a computation much faster than a sequential program.

This course will have challenging programming assignments. They will be challenging for several reasons:

-   *Designing parallel algorithms is hard*. We will cover a number of good strategies for designing parallel algorithms, but you should expect to spend significant time up-front using pencil and paper to design an algorithm for your program before you start coding.
-   *Reasoning about the behavior of parallel programs is much more complicated than reasoning about the behavior of sequential programs*. You should expect to spend significant time and energy debugging your programs.
-   *Threading and message-passing libraries, such as pthreads and MPI, are complex*. You should expect to spend a significant amount of time reading the text and online resources to get up to speed.

For all of these reasons, it is **absolutely essential** that you start programming assignments early. I will give you plenty of time to complete each assignment, but if you wait until the last minute to start, I will not make a heroic effort to help you complete it. For some assignments, I may ask you to submit a written design, with an outline of your algorithm, before you start the implementation.

We will be writing programs in the C programming language. If you do not know C well, you will need to get up to speed quickly. I recommend any of the following books:

-   Samuel P. Harbison, Guy L. Steele, [C: A Reference Manual](http://www.careferencemanual.com/). If you're going to buy one C book, this is an excellent one.
-   Peter Prinz, Tony Crawford, [C in a Nutshell](http://oreilly.com/catalog/9780596006976/). Another very good general reference on C.
-   P.J. Plaugher and Jim Brodie, [Standard C: A Reference](http://www.amazon.com/Standard-Reference-Prentice-Programming-Methodologies/dp/0134364112). An excellent quick reference. Any edition is fine.
-   Peter Prinz, Ulla Kirch-Prinz, [C Pocket Reference](http://oreilly.com/catalog/9780596004361/). Another good quick reference.

We will be developing and running programs on computers running Linux. You may wish to buy a general introduction to Linux or Unix.

Learning Outcomes
-----------------

By the end of this course, you will be able to:

-   Design and implement parallel programs using threading and message-passing methods of communication between parallel tasks
-   Run parallel programs on multiprocessors and clusters
-   Understand and analyze the performance of parallel algorithms and programs

Policies
--------

### Grades

Grades are assigned on a 100-point scale:

> |Numeric Range|Letter Grade|
> |-------------|------------|
> |90-100|A (4.0)|
> |85-90|B+ (3.5)|
> |80-85|B (3.0)|
> |75-80|C+ (2.5)|
> |70-75|C (2.0)|
> |60-70|D (1.0)|
> |0-60|F (0.0)|

Your overall grade for the course will be determined as follows:

-   Programming assignments: 40%
-   Two midterm exams: 40% (20% each)
-   Final project: 10%
-   Quizzes, Attendance and participation: 5%
-   Labs: 5%

### Course website

Please check the course web page, <http://ycpcs.github.io/cs365-spring2019>, regularly for important announcements.

### Reading Assignments

Reading assignments will be posted on the course web page. I expect you to do the reading **before** class. When I give a lecture, I will assume you have done the reading. I encourage you to use class time to ask questions about parts of the reading you did not understand to your satisfaction.

### Posting and submission of assignments and labs

Assignments will be posted on the course web page, <http://ycpcs.github.io/cs365-spring2019>.

Assignments will be submitted using the server <https://cs.ycp.edu/marmoset>. You will receive an email containing the username and password you should use for this server.

### Academic Integrity

The college catalog states the following:

> Academic dishonesty will not be tolerated at York College. Academic dishonesty refers to actions such as, but not limited to, cheating, plagiarism, fabrication of research, falsification of academic documents, etc., and includes all situations where students make use of the work of others and claim such work as their own.

Please refer to the college catalog for an explanation of the official college policies relating to academic integrity.

The following policy pertains to homework and graded (individual) programming assignments in this course:

> All homework assignments and graded (individual) programming assignments are to be completed individually. I encourage you to discuss high level concepts and strategies with other students, but any work you submit **must be yours alone**.
>
> Direct copying of code or other work from other students, web sites, or other sources **is absolutely forbidden under any circumstances**.
>
> Any sources (books, websites, articles, fellow students, etc.) that you consult in completing an assignment **must be properly acknowledged**. In general, I strongly discourage you from using any resource not explicitly listed in the course syllabus or on the course web page. When you work on a programming assignment, it must be **your** program, not your adaptation of someone else's program.

In order to receive credit for an individual homework assignment or programming assignment, you must submit a signed attestation confirming that you completed the assignment on your own, and did not copy any code or other material from any person or source.

Quizzes and exams must be completed individually.

Any violation of the course's academic integrity policy will be referred to the Dean of Academic Affairs, and could have consequences ranging from a 0 on an assignment to dismissal from the college.

### Late Assignments

Late assignments will be marked down 10% per day late. No credit is given for assignments turned in more two three (2) days late.

### Exams

No make-up exams will be given without approval of the instructor prior to class unless proof of extreme emergency or illness is provided. All exams will be open book and open notes.

### Attendance and Participation

I expect you to attend class and participate regularly in class activities. If you miss a class, please notify me in advance. You are responsible for all material covered in class, regardless of whether or not you were present. If you attend and participate in class regularly, you can expect to receive full credit for attendance and participation. Frequent absence and/or lack of participation in class activities will reduce the credit you receive for attendance and participation.

### Disability accomodation

If you had an IEP or 504 plan in high school or if you have a disability or health condition that impacts you in the classroom, please contact Linda Miller, Director of Disability Support Services, at 815-1785 or <lmille18@ycp.edu> to discuss obtaining the accommodations for which you may be eligible. If you already have an accommodation memo and wish to access your accommodations in this class, please see me confidentially to discuss.

### Use of Personal Technology in the Classroom

While York College recognizes students’ need for educational and emergency-related technological devices such as laptops, PDA’s, cellular phones, etc., using them unethically or recreationally during class time is never appropriate. The college recognizes and supports faculty members’ authority to regulate in their classrooms student use of all electronic devices.

### Communication Standards

York College recognizes the importance of effective communication in all disciplines and careers. Therefore, students are expected to competently analyze, synthesize, organize, and articulate course material in papers, examinations and presentations. In addition, students should know and use communication skills current to their field of study, recognize the need for revision as part of their writing process, and employ standard conventions of English usage in both writing and speaking. Students may be asked to further revise assignments that do not demonstrate effective use of these communication skills.
