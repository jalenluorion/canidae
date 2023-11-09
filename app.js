const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const getCourseInfo = require("./infiniteCampus/campus.js");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const ToDo = require("./db/toDoModel");
const Note = require("./db/notesModel");
const Stats = require("./db/statisticsModel");
const Space = require("./db/spaceModel");
const auth = require("./auth");

// execute database connection
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

// Register endpoint with input validation
app.post("/api/register", async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    const userId = new mongoose.Types.ObjectId();
    const defaultSpace = new mongoose.Types.ObjectId();

    const periodsData = [
      { period: 0 },
      { period: 1 },
      { period: 2 },
      { period: 3 },
      { period: 4 },
      { period: 5 },
      { period: 6 },
      { period: 7 },
    ];

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
      settings: {
        background: 0,
      },
      _id: defaultSpace,
    });

    const toDo = new ToDo({
      owner: userId, // You may replace this with a valid user Id
      tasks: [],
    });
    const note = new Note({
      owner: userId,
      lists: {},
    });
    const stats = new Stats({
      owner: userId,
      tasksCompleted: 0,
      notesDownloaded: 0,
      timersFinished: 0,
    });

    await user.save();
    await toDo.save();
    await note.save();
    await stats.save();

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
    response.status(201).json({ message: "User Created and Logged In Successfully", userId: user._id });
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
        defaultSpace: user.defaultSpace,
      },
      process.env.JWT_SECRET // Use environment variable for JWT secret
    );

    response.cookie("token", token, { httpOnly: true });

    response.status(200).json({ message: "Login Successful", defaultSpace: user.defaultSpace });
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

// Verify if cookie user id equal to request user id
app.get("/api/verify", auth, async (request, response) => {
  try {
    const queryId = request.query.id;
    const loggedInUser = await User.findOne({ _id: request.user.userId });
    const requestedUser = await User.findOne({ _id: queryId });

    if (!requestedUser) {
      return response.status(404).json({ message: "Requested user not found" });
    }

    if (loggedInUser._id.equals(requestedUser._id)) {
      return response.status(200).json({ message: "User verified", user: loggedInUser });
    }

    response.status(404).json({ message: "User not validated" });
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
    const noteLists = await Note.findOne({ owner: request.user.userId });

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
    const noteLists = await Note.findOne({ owner: request.user.userId });

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
        course.name = courseName[0] + "\u200B/" + courseName[1];
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
    const stats = await Stats.findOne({ owner: request.user.userId });

    response.status(200).json(stats);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/api/stats", auth, async (request, response) => {
  try {
    const stats = await Stats.findOne({ owner: request.user.userId });

    if (!stats) {
      return response.status(404).json({ message: "User not found" });
    }

    if (request.body.tasksCompleted) {
      stats.tasksCompleted += request.body.tasksCompleted;
    }
    if (request.body.notesDownloaded) {
      stats.notesDownloaded += request.body.notesDownloaded;
    }
    if (request.body.timersFinished) {
      stats.timersFinished += request.body.timersFinished;
    }

    await stats.save();

    response.status(200).json({ message: "Stats updated successfully", stats });

  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
