import { ObjectId } from 'mongodb';

interface Notes {
    owner: ObjectId;
    notes: string[];
    notesDownloaded: number;
}

interface ToDos {
    owner: ObjectId;
    tasks: Task[];
    tasksCompleted: number;
}

interface Timer {
    owner: ObjectId;
    timer: number;
    timersFinished: number;
}

interface Task {
    id: ObjectId;
    name: string;
    completed: boolean;
    period: number;
    periodColor: string;
    dueDate: Date;
}

export {
    Notes,
    ToDos,
    Timer
};
