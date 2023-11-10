const mongoose = require("mongoose");

// user schema
const SpaceSchema = new mongoose.Schema({
    // owner field
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    // settings field
    settings: {
        type: Object,
        required: true,
    },

    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
});

// export UserSchema
module.exports = mongoose.model("Spaces", SpaceSchema);
