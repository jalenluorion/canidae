const mongoose = require("mongoose");

const User = require("./userModel");
const Space = require("./spaceModel");

async function editDB() {
    const users = await User.find({});

    users.forEach((user) => {
        const spaceID = new mongoose.Types.ObjectId();
        const space = new Space({
            owner: user._id,
            name: user.name + "'s Space",
            settings: {
                background: 0,
            },
            _id: spaceID,
        });
        space.save();
        user.defaultSpace = spaceID;
        user.save();
    });
}

module.exports = editDB;