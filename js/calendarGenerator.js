

Array.prototype.myincludes = function(value) {
    return this.indexOf(value) > -1 || !1;
};



// this function generates all the dates for the calendar (including final exam days),
// creates CalendarEntry objects, and populates the calendar array
function generateDates() {
    var dateIter = new Date(semesterInfo.firstDayOfSemester.getTime());

    // create array of potential class dates (some of these dates may end up being vacation days)
    while (dateIter <= semesterInfo.lastDayOfSemester) {
        if (courseInfo.classDays.myincludes(days[dateIter.getDay()])) {
            calendar.push( {date: new Date(dateIter.getTime())} );
        }
        dateIter.setDate(dateIter.getDate() + 1);  // add 1 day
    }
}



function populateVacationDays() {
    for (var i=0; i < calendar.length; i++) {
        // make a copy of the date and set the time of the copy to midnight
        // since all vacation days have a timestamp of midnight
        var date = new Date(calendar[i].date.getTime());
        date.setHours(0);

        // iterate over the vacation ranges to see if any of the calendar dates fall during a vacation
        for (var j=0; j < semesterInfo.vacationDates.length; j++) {
            if ((date.getTime() >= semesterInfo.vacationDates[j].startDate.getTime()) &&
                (date.getTime() <= semesterInfo.vacationDates[j].endDate.getTime())) {
                calendar[i].topic = semesterInfo.vacationDates[j];
            }
        }
    }
}



// if the final exam is during the final exam period, add those dates
// to the array of dates that need calendar entries
function populateFinalExams() {
    if (!courseInfo.inClassFinalExam) {
        for (var i=0; i < courseInfo.finalExamDates.length; i++) {
            calendar.push(
                {
                    date: courseInfo.finalExamDates[i].date,
                    topic: courseInfo.finalExamDates[i]
                });
        }
    }
}



function getRegularSemesterDays() {
    return calendar.length - ((courseInfo.inClassFinalExam)? 0 : courseInfo.finalExamDates.length);
}



function populateCalendar() {
    var regularSemesterDays = getRegularSemesterDays();

    for (var calendarIndex=0, topicIndex=0; calendarIndex < regularSemesterDays; calendarIndex++) {
        if ((calendar[calendarIndex].topic === undefined) && (courseInfo.classPeriods[topicIndex] !== undefined)) {
            calendar[calendarIndex].topic = courseInfo.classPeriods[topicIndex].topic;
            // calendar[calendarIndex].reading = courseInfo.classPeriods[topicIndex].reading;
            calendar[calendarIndex].lab = courseInfo.classPeriods[topicIndex].lab;
            calendar[calendarIndex].assign = courseInfo.classPeriods[topicIndex].assign;
            calendar[calendarIndex].reading = courseInfo.classPeriods[topicIndex].reading;
            topicIndex++;
        }
    }
}



// how many days in the calendar are part of the regular semester
// this includes vacation days, but not final exam days
function getDateString(date) {
    return days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate();
}



// Takes a Date object, extracts the time of day
// and converts it from 24-hour time to 12-hour AM/PM time.
// Returns a string representation of the 12-hour time.
function getStandardTimeString(date) {
    var timeString = "";
    var hours = date.getHours();
    var minutes = date.getMinutes();

    if (hours > 0 && hours <= 12) {
        timeString = "" + hours;
    } else if (hours > 12) {
        timeString = "" + (hours - 12);
    } else if (hours === 0) {
        timeString = "12";
    }
    timeString += (minutes < 10) ? ":0" + minutes : ":" + minutes;
    timeString += (hours >= 12) ? " PM" : " AM";
    return timeString;
}



// not all topics link to material, for those that don't link, don't create a link
function linkify(title, link) {
    var str = "";

    if (link === "") {
        str = title;
    } else {
        str = "<a href=\"" + link + "\">" + title + "</a>";
    }
    return title.match("^\\*\\*") ? ("<strong>" + str.substring(2) + "</strong>") : str;
}



function getTopicString(topic) {
    var str = "";
    if (topic instanceof Topic) {
        str = linkify(topic.title, topic.link);
    } else if (topic instanceof DoubleTopic) {
        str = linkify(topic.title1, topic.link1);
        str += "<br>";
        str += linkify(topic.title2, topic.link2);
    } else if (topic instanceof TripleTopic) {
        str = linkify(topic.title1, topic.link1);
        str += "<br>";
        str += linkify(topic.title2, topic.link2);
        str += "<br>";
        str += linkify(topic.title3, topic.link3);
    } else if (topic instanceof VacationDays) {
        str = "<strong>NO CLASS - " + topic.description + "</strong>";
    } else if (topic instanceof FinalExamDay) {
        str = "<strong>FINAL EXAM for Section " + topic.section + " @ " + getStandardTimeString(topic.date) + "</strong>";
    }
    return str;
}



function getReadingString(reading) {
    return (reading !== undefined) ? reading : "";
}



function isLab(lab) {
    return (lab instanceof Lab)
        || (lab instanceof NumberedLab)
        || (lab instanceof NumberedLabNoFile);
}


// checks to see if a valid lab is available
// and only displays the lab on the calendar if the lab date has arrived
function getLabString(lab, assignOnDate) {
    var str = "";
    var today = new Date();

    if (isLab(lab) && (assignOnDate.getTime() < today.getTime() || PREPOPULATE)) {
        str = linkify(lab.title, lab.link);
    }
    return str;
}


function getFileString(file) {
    if (!file) { return "n/a"; }
    return linkify(file, file);
}


// checks to see if a valid assignment is available
// and only displays the assignment on the calendar if the assignment date has arrived
function getAssignmentString(assign, assignOnDate) {
    var str = "";
    var today = new Date();
    var dueDate = "";

    if ((assign instanceof Assignment) && (assignOnDate.getTime() < today.getTime() || PREPOPULATE)) {
        str = linkify(assign.title, assign.link);
        dueDate = new Date(assignOnDate.getTime());
        dueDate.setDate(dueDate.getDate() + assign.daysToComplete);
        str += "<br>Due " + getDateString(dueDate) + " by 11:59 PM";
    } else if ((assign instanceof Homework) && (assignOnDate.getTime() < today.getTime() || PREPOPULATE)) {
        str = linkify(assign.title, assign.link);
        dueDate = new Date(assignOnDate.getTime());
        dueDate.setDate(dueDate.getDate() + assign.daysToComplete);
        str += "<br>Due " + getDateString(dueDate) + " in class";
    }
    return str;
}



function printCalendar(opts) {

    var regularSemesterDays = getRegularSemesterDays();

    document.write("<table>");
    document.write("<thead><tr><th>Date</th><th>Topic</th>");
    if (!opts.omitReadings) { document.write("<th>Reading</th>"); }
    if (!opts.omitLabs) { document.write("<th>Lab</th></tr>"); }
    document.write("</thead>");
        //document.write("<tbody>");

    // Number of items to print
    var numItems = calendar.length;
    if (opts.omitFinalExams && !courseInfo.inClassFinalExam) {
        numItems -= courseInfo.finalExamDates.length;
    }

    // this for-loop prints all the rows for the calendar
    for (var i=0; i < numItems; i++) {
/*
        // this if-statement adds an extra 'empty' row between each week to make the week boundaries stand out a bit more
        // an extra boundary is NOT added after the last item unless there is a final exam that is taken during the final
        // exam period (i.e. not an in-class final).
        if (((i !== 0) && (days[calendar[i].date.getDay()] === courseInfo.classDays[0])) || (!courseInfo.inClassFinalExam && i === regularSemesterDays)) {
            document.write("<tr><td></td><td></td><td></td><td></td></tr>");
        }
*/
        document.write("<tr>");
        document.write("<td>" + getDateString(calendar[i].date) + "</td>");
        document.write("<td>" + getTopicString(calendar[i].topic) + "</td>");
        document.write("<td>" + getReadingString(calendar[i].reading) + "</td>");
        if (!opts.omitLabs) { document.write("<td>" + getLabString(calendar[i].lab, calendar[i].date) + "</td>"); }
        document.write("<td>" + getAssignmentString(calendar[i].assign, calendar[i].date) + "</td>");
        document.write("</tr>");
    }
        //document.write("</tbody>");
    document.write("</table>");
}


function printLabs(opts) {
    document.write("<table>");
    document.write("<thead><tr><th>Date</th><th>Lab</th><th>File(s)</th>");
 
    // Number of items to print
    var numItems = calendar.length;
    if (opts.omitFinalExams && !courseInfo.inClassFinalExam) {
        numItems -= courseInfo.finalExamDates.length;
    }

    for (var i = 0; i < numItems; i++) {
        document.write("<tr>");
        document.write("<td>" + getDateString(calendar[i].date) + "</td>");

        if (!calendar[i].lab) {
            // no lab on this date, so use the topic
            document.write("<td>" + getTopicString(calendar[i].topic) + "</td>");
            document.write("<td></td>");
        } else {
            document.write("<td>" + getLabString(calendar[i].lab, calendar[i].date) + "</td>");
            document.write("<td>" + getFileString(calendar[i].lab.file) + "</td>");
        }
        document.write("</tr>");
    }

    document.write("</table>");
}


function autogenCalendar(opts) {
    if (opts === undefined) { opts = {}; }
    generateDates();
    populateVacationDays();
    populateFinalExams();
    populateCalendar();
    printCalendar(opts);
}


function autogenLabs(opts) {
    if (opts === undefined) { opts = {}; }
    opts.omitFinalExams = true; // don't ever add final exams to labs schedule
    generateDates();
    populateVacationDays();
    populateFinalExams();
    populateCalendar();
    printLabs(opts);
}
