const mongoose = require("mongoose");

// User schema
const StatsSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },

    tasksCompleted: {
        type: Number,
        required: true,
        default: 0,
    },

    notesDownloaded: {
        type: Number,
        required: true,
        default: 0,
    },

    timersFinished: {
        type: Number,
        required: true,
        default: 0,
    },
});

// Export User model
module.exports = mongoose.model("Stats", StatsSchema);
