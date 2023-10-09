const mongoose = require("mongoose");

// Single to-do schema
const SingleToDoSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    // Task completion status
    isCompleted: {
        type: Boolean,
        default: false,
        required: true,
    },
});

// To-Do List schema
const ToDoListSchema = new mongoose.Schema({
    // Title of the to-do list
    period: {
        type: Number,
        required: true,
    },

    // Array of tasks in the to-do list
    tasks: {
        type: [SingleToDoSchema],
        required: true,
    },
});

// User schema
const ToDoSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    // Array of up to 7 to-do lists per user
    toDoLists: {
        type: [ToDoListSchema],
        required: true,
    },
});

// Export User model
module.exports = mongoose.model("ToDo", ToDoSchema);
