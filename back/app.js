const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

// require database connection
const dbConnect = require("./db/dbConnect");
const User = require("./db/userModel");
const ToDo = require("./db/toDoModel");
const Note = require("./db/notesModel");
const auth = require("./auth");

// execute database connection
dbConnect();
app.use(cookieParser());

// Middleware to handle CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get("/", (request, response) => {
  response.json({ message: "Hey! This is your server response!" });
});

// Register endpoint with input validation
app.post("/register", async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const userID = new mongoose.Types.ObjectId();

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
      _id: userID,
    });
    const toDo = new ToDo({
      owner: userID, // You may replace this with a valid user ID
      toDoLists: periodsData.map((periodData) => ({
        period: periodData.period,
        tasks: [],
      })),
    });
    const note = new Note({
      owner: userID,
      noteLists: periodsData.map((periodData) => ({
        period: periodData.period,
        note: "",
      })),
    });

    await user.save();
    await toDo.save();
    await note.save();

    // After successful registration, log in the user by generating a JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        userUsername: user.username,
      },
      process.env.JWT_SECRET // Use environment variable for JWT secret
    );

    // Set the JWT token in a cookie
    //response.cookie("token", token);

    // Respond with a success message and the JWT token
    response.status(201).send({ message: "User Created and Logged In Successfully", token });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint with input validation
app.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({ username: request.body.username });
    if (!user) {
      return response.status(404).send({ message: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(request.body.password, user.password);
    if (!passwordCheck) {
      return response.status(400).send({ message: "Passwords do not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email,
        userName: user.name,
        userUsername: user.username,
      },
      process.env.JWT_SECRET // Use environment variable for JWT secret
    );

    //response.cookie("token", token);

    response.status(200).send({ message: "Login Successful", token });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Get to-do lists for a user
app.get("/todo", auth, async (request, response) => {
  try {
    const toDoLists = await ToDo.find({ owner: request.user.userId });

    response.status(200).send(toDoLists);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/todo/:listPeriod", auth, async (request, response) => {
  try {
    // Find the user by their ID
    const user = await ToDo.findOne({ owner: request.user.userId });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const listPeriod = request.params.listPeriod;
    
    const listIndex = user.toDoLists.findIndex((list) => list.period.toString() === listPeriod);

    if (listIndex === -1) {
      return response.status(404).json({ message: "To-do list not found" });
    }

    // Update the specified list with the updatedSingleList
    user.toDoLists[listIndex].tasks = request.body.updatedList;

    // Save the updated user document
    await user.save();

    response.status(200).json({ message: "To-do list updated successfully", user });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Get notes for a user
app.get("/notes", auth, async (request, response) => {
  try {
    const noteLists = await Note.find({ owner: request.user.userId });

    response.status(200).send(noteLists);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/notes/:listPeriod", auth, async (request, response) => {
  try {
    // Find the user by their ID
    const user = await Note.findOne({ owner: request.user.userId });

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const listPeriod = request.params.listPeriod;
    
    const listIndex = user.noteLists.findIndex((list) => list.period.toString() === listPeriod);

    if (listIndex === -1) {
      return response.status(404).json({ message: "Note list not found" });
    }

    // Update the specified list with the updatedSingleList
    user.noteLists[listIndex].note = request.body.updatedList;

    // Save the updated user document
    await user.save();

    response.status(200).json({ message: "Note list updated successfully", user });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
