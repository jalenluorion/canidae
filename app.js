// Imports
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const getCourseInfo = require("./infiniteCampus/campus.js");
const auth = require("./auth.js");

// Get database stuff
const dbConnect = require("./db/dbConnect.js");
const User = require("./db/userModel.js");
const Space = require("./db/spaceModel.js");
const { NoteList, ToDo, Timer } = require("./db/viewModels.js");

// Start database connection
dbConnect();

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get("/api", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// Register new user endpoint with input validation
app.post("/api/register", async (request, response) => {
  try {
    // Generate hash of password and IDs of the user and the user's default space
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const userId = new mongoose.Types.ObjectId();
    const defaultSpace = new mongoose.Types.ObjectId();

    // Create DB entrys for user and user's default space
    const user = new User({
      email: request.body.email,
      password: hashedPassword,
      name: request.body.name,
      username: request.body.username,
      defaultSpace: defaultSpace,
      _id: userId,
    });
    const space = new Space({
      owner: userId,
      name: request.body.name + "'s Space",
      settings: {
        background: 0,
      },
      _id: defaultSpace,
    });

    // DB entrys for the views
    const noteList = new NoteList({
        owner: userId,
        lists: [],
        notesDownloaded: 0,
    });
    const toDo = new ToDo({
        owner: userId,
        tasks: [],
        tasksCompleted: 0,
    });
    const timer = new Timer({
        owner: userId,
        timer: 0,
        timersFinished: 0,
    });

    await user.save();
    await toDo.save();
    await noteList.save();
    await timer.save();
    await space.save();

    // After successful registration, log in the user by generating a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET // Use environment variable for JWT secret
    );

    // Set the JWT token in a cookie
    response.cookie("token", token);

    // Respond with a success message and the JWT token
    response.status(201).json({ message: "User Created and Logged In Successfully", user: user });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint with input validation
app.post("/api/login", async (request, response) => {
  try {
    const user = await User.findOne({ username: request.body.username });
    if (!user) {
      return response.status(404).send({ message: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(request.body.password, user.password);
    if (!passwordCheck) {
      return response.status(400).json({ message: "Passwords do not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET // Use environment variable for JWT secret
    );

    response.cookie("token", token, { httpOnly: true });

    response.status(200).json({ message: "Login Successful", user: user });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Logout endpoint
app.post("/api/logout", (request, response) => {
  // Delete the token cookie by setting it to null and expiring it
  response.clearCookie("token", "null", { httpOnly: true });

  response.status(200).json({ message: "Logout Successful" });
});

// Get user details
app.get("/api/user", auth, async (request, response) => {
  try {
    const user = await User.findOne({ _id: request.user.userId });
    
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    response.status(200).json({ message: "User found", user: user })
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Verify if cookie user id is allowed in space
app.get("/api/verify", auth, async (request, response) => {
  try {
    const queryId = request.query.id;
    const requestedUser = await User.findOne({ _id: request.user.userId });
    const requestedSpace = await Space.findOne({ _id: queryId });

    if (!requestedUser) {
      return response.status(404).json({ message: "User not logged in!" });
    }
    if (!requestedSpace) {
      return response.status(404).json({ message: "Space not found!" });
    }

    if (requestedUser._id.equals(requestedSpace.owner)) {
      return response.status(200).json({ message: "User verified", user: requestedUser, space: requestedSpace});
    }

    response.status(404).json({ message: "User not validated" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/space/settings", auth, async (request, response) => {
  try {
    const space = await Space.findOne({ _id: request.query.id });

    if (!space) {
      return response.status(404).json({ message: "Space not found" });
    }

    space.settings = request.body;

    await space.save();

    response.status(200).json({ message: "Space settings updated successfully", space });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Get to-do lists for a user
app.get("/api/todo", auth, async (request, response) => {
  try {
    const toDoLists = await ToDo.findOne({ owner: request.user.userId });

    response.status(200).json(toDoLists);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Update to-do lists for a user
app.post("/api/todo", auth, async (request, response) => {
  try {
    // Find the user by their Id
    const toDoLists = await ToDo.findOne({ owner: request.user.userId });

    if (!toDoLists) {
      return response.status(404).json({ message: "User not found" });
    }

    // Update the specified list with the updatedSingleList
    toDoLists.tasks = request.body;

    // Save the updated toDoLists document
    await toDoLists.save();

    response.status(200).json({ message: "To-do list updated successfully", toDoLists });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Get notes for a user
app.get("/api/notes", auth, async (request, response) => {
  try {
    const noteLists = await NoteList.findOne({ owner: request.user.userId });

    response.status(200).json(noteLists);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Update notes for a user
app.post("/api/notes", auth, async (request, response) => {
  try {
    // Find the user by their Id
    const noteLists = await NoteList.findOne({ owner: request.user.userId });

    if (!noteLists) {
      return response.status(404).json({ message: "User not found" });
    }

    // Update the specified list with the updatedSingleList
    noteLists.lists = request.body;

    // Save the updated noteLists document
    await noteLists.save();

    response.status(200).json({ message: "Note list updated successfully", noteLists });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/campus", async (request, response) => {
  try {
    const courseInfo = await getCourseInfo(request.body.district, request.body.state, request.body.email, request.body.password);

    courseInfo.forEach((course) => {
      const teacherName = course.teacher.split(", ");
      const teacherFirstName = teacherName[1].split(" ")[0];
      const teacherLastName = teacherName[0];
      const teacherEmail = `${teacherFirstName.toLowerCase()}.${teacherLastName.toLowerCase()}@boiseschools.org`;
      course.teacherEmail = teacherEmail;
    });

    // take course.name, and if there is a / sign, add zero width space after it but keep the / sign
    courseInfo.forEach((course) => {
      const courseName = course.name.split("/");
      if (courseName.length > 1) {
        course.name = courseName[0] + "/\u200B" + courseName[1];
      }
    });

    response.status(200).json(courseInfo);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/stats", auth, async (request, response) => {
  try {
    const toDoStat = await ToDo.findOne({ owner: request.user.userId });
    const noteStat = await NoteList.findOne({ owner: request.user.userId });
    const timerStat = await Timer.findOne({ owner: request.user.userId });

    response.status(200).json({ tasksCompleted: toDoStat.tasksCompleted, notesDownloaded: noteStat.notesDownloaded, timersFinished: timerStat.timersFinished });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/api/stats", auth, async (request, response) => {
  try {
    if (request.body.tasksCompleted) {
        const toDoStat = await ToDo.findOne({ owner: request.user.userId });
        if (!toDoStat) {
            return response.status(404).json({ message: "User not found" });
        }
        toDoStat.tasksCompleted += request.body.tasksCompleted;
        await toDoStat.save();
        response.status(200).json({ message: "Stats updated successfully", tasksCompleted: toDoStat.tasksCompleted });
    }
    if (request.body.notesDownloaded) {
        const noteStat = await NoteList.findOne({ owner: request.user.userId });
        if (!noteStat) {
            return response.status(404).json({ message: "User not found" });
        }
        noteStat.notesDownloaded += request.body.notesDownloaded;
        await noteStat.save();
        response.status(200).json({ message: "Stats updated successfully", notesDownloaded: noteStat.notesDownloaded });
    }
    if (request.body.timersFinished) {
        const timerStat = await Timer.findOne({ owner: request.user.userId });
        if (!timerStat) {
            return response.status(404).json({ message: "User not found" });
        }
        timerStat.timersFinished += request.body.timersFinished;
        await timerStat.save();
        response.status(200).json({ message: "Stats updated successfully", timersFinished: timerStat.timersFinished });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
