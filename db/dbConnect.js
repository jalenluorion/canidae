// external imports
const mongoose = require("mongoose");
require('dotenv').config()

const User = require("./userModel");
const Space = require("./spaceModel");

async function dbConnect() {
  // use mongoose to connect this app to our database on mongoDB using the DB_URL (connection string)
  mongoose
    .connect(
      process.env.DB_URL,
      {
        //   these are options to ensure that the connection is done properly
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
      // for each user, create a space document
      // const users = await User.find({});

      
      // users.forEach((user) => {
      //   const spaceID = new mongoose.Types.ObjectId();
      //   const space = new Space({
      //     owner: user._id,
      //     name: user.name + "'s Space",
      //     settings: {
      //       background: 0,
      //     },
      //     _id: spaceID,
      //   });
      //   space.save();
      //   user.defaultSpace = spaceID;
      //   user.save();
        
      // });
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;