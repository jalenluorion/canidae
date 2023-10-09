const mongoose = require("mongoose");

// To-Do List schema
const NoteSchema = new mongoose.Schema({
    period: {
        type: Number,
        required: true,
    },

    note: {
        type: String,
        required: true,
    },
});

// User schema
const NoteListSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    toDoLists: {
        type: [NoteSchema],
        required: true,
    },
});

// Export User model
module.exports = mongoose.model("Notes", NoteListSchema);
