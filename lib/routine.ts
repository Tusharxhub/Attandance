export interface Period {
    id: string; // e.g., "p1", "p2"
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    room?: string;
    type: "Theory" | "Lab";
}

export interface DayRoutine {
    day: string;
    periods: Period[];
}

export const routine: DayRoutine[] = [
    {
        day: "Monday",
        periods: [
            { id: "p1", startTime: "09:30", endTime: "10:25", subject: "Operating Systems (CSE11150)", teacher: "Victor Das", type: "Theory" },
            { id: "p3", startTime: "11:30", endTime: "12:25", subject: "Unstructured Database Lab (CSE12203)", teacher: "Prabhat Das", type: "Lab" },
            { id: "p6", startTime: "14:30", endTime: "15:25", subject: "Disaster Management (CEE11029)", teacher: "Nabarun Dey", type: "Theory" },
            { id: "p7", startTime: "15:30", endTime: "16:25", subject: "Unstructured Database Lab (CSE12203)", teacher: "Prabhat Das", type: "Lab" },
        ]
    },
    {
        day: "Tuesday",
        periods: [
            { id: "p1", startTime: "09:30", endTime: "10:25", subject: "Operating Systems (CSE11150)", teacher: "Victor Das", type: "Theory" },
            { id: "p2", startTime: "10:30", endTime: "11:25", subject: "Unstructured Database (CSE11202)", teacher: "Prabhat Das", type: "Theory" },
            { id: "p3", startTime: "11:30", endTime: "12:25", subject: "Introduction to Machine Learning (CSE11206)", teacher: "Sayantan Singha Roy", type: "Theory" },
            { id: "p8", startTime: "16:30", endTime: "17:25", subject: "Introduction to Machine Learning Lab", teacher: "Sayantan Singha Roy", type: "Lab" },
        ]
    },
    {
        day: "Wednesday",
        periods: [
            { id: "p1", startTime: "09:30", endTime: "10:25", subject: "Unstructured Database (CSE11202)", teacher: "Prabhat Das", type: "Theory" },
            { id: "p2", startTime: "10:30", endTime: "11:25", subject: "Introduction to Machine Learning Lab (CSE12207)", teacher: "Sayantan Singha Roy", type: "Lab" },
            { id: "p4", startTime: "12:30", endTime: "13:25", subject: "Introduction to Machine Learning", teacher: "Sayantan Singha Roy", type: "Theory" },
            { id: "p6", startTime: "14:30", endTime: "15:25", subject: "Disaster Management (CEE11029)", teacher: "Nabarun Dey", type: "Theory" },
            { id: "p7", startTime: "15:30", endTime: "16:25", subject: "Operating System Lab (CSE12156)", teacher: "Victor Das", type: "Lab" },
        ]
    },
    {
        day: "Thursday",
        periods: [
            { id: "p1", startTime: "09:30", endTime: "10:25", subject: "Operating System Lab (CSE12156)", teacher: "Victor Das", type: "Lab" },
            { id: "p4", startTime: "12:30", endTime: "13:25", subject: "Unstructured Database", teacher: "Prabhat Das", type: "Theory" },
            { id: "p6", startTime: "14:30", endTime: "15:25", subject: "Introduction to Machine Learning (CSE11206)", teacher: "Sayantan Singha Roy", type: "Theory" },
            { id: "p7", startTime: "15:30", endTime: "16:25", subject: "Mini Project-III (CSE14144)", teacher: "Bodhi Chakraborty", type: "Lab" },
        ]
    },
    {
        day: "Friday",
        periods: [
            { id: "p1", startTime: "09:30", endTime: "10:25", subject: "Operating Systems (CSE11150)", teacher: "Victor Das", type: "Theory" },
            { id: "p6", startTime: "14:30", endTime: "15:25", subject: "Disaster Management (CEE11029)", teacher: "Nabarun Dey", type: "Theory" },
        ]
    },
    {
        day: "Saturday",
        periods: []
    }
];
