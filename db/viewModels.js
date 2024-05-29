const mongoose = require("mongoose");

// Note schema
const NoteListSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },

    lists: {
        type: Object,
        required: true,
    },

    notesDownloaded: {
        type: Number,
        required: true,
        default: 0,
    },
}, {
    minimize: false,
});

// ToDo schema
const ToDoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },

    // Array of up to 7 to-do lists per user
    tasks: {
        type: [Object],
        required: true,
    },

    tasksCompleted: {
        type: Number,
        required: true,
        default: 0,
    },
});

const TimerSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },

    // Array of up to 7 to-do lists per user
    timer: {
        type: Number,
        required: true,
    },

    timersFinished: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = {
    NoteList: mongoose.model("NoteList", NoteListSchema),
    ToDo: mongoose.model("ToDo", ToDoSchema),
    Timer: mongoose.model("Timer", TimerSchema)
};
