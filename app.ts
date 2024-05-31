// Imports
import express, { Request, Response } from "express";
const app = express();
import * as bodyParser from "body-parser";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { ObjectId } from "mongodb";
import auth, { AuthRequest } from "./auth.js";

// Get database stuff
import Database from "./db/dbConnect.js";
import User from "./db/models/userModel.js";
import Space from "./db/models/spaceModel.js";
import { Notes, ToDos, Timer } from "./db/models/viewModels.js";

// Start database connection
const database = new Database();
const usersCollection = database.collections.users
const spacesCollection = database.collections.spaces
const notesCollection = database.collections.views.notes
const toDosCollection = database.collections.views.toDos
const timersCollection = database.collections.views.timer

// Middleware for parsing cookies
app.use(cookieParser());

// Middleware to handle CORS
app.use((req: Request, res: Response, next) => {
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root endpoint
app.get("/api", (req: Request, res: Response) => {
  res.json({ message: "Hey! This is your server response!" });
});

// Register new user endpoint with input validation
app.post("/api/register", async (req: Request, res: Response) => {
    try {
        // Generate hash of password and IDs of the user and the user's default space
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userId = new ObjectId();
        const defaultSpace = new ObjectId();

        // Create DB entries for user and user's default space
        const user: User = {
            email: req.body.email,
            password: hashedPassword,
            name: req.body.name,
            username: req.body.username,
            defaultSpace: defaultSpace,
            _id: userId,
        };
        const space: Space = {
            owner: userId,
            name: req.body.name + "'s Space",
            settings: {
                background: 0,
            },
            _id: defaultSpace,
        };

        // DB entries for the views
        const noteList: Notes = {
            owner: userId,
            notes: [],
            notesDownloaded: 0,
        };
        const toDo: ToDos = {
            owner: userId,
            tasks: [],
            tasksCompleted: 0,
        };
        const timer: Timer = {
            owner: userId,
            timer: 0,
            timersFinished: 0,
        };

        await usersCollection.insertOne(user);
        await spacesCollection.insertOne(space);

        await toDosCollection.insertOne(toDo);
        await notesCollection.insertOne(noteList);
        await timersCollection.insertOne(timer);

        // After successful registration, log in the user by generating a JWT token
        const token = jwt.sign(
            user._id,
            process.env.JWT_SECRET || "" // Use environment variable for JWT secret
        );

        // Set the JWT token in a cookie
        res.cookie("token", token);

        // Respond with a success message and the JWT token
        res.status(201).json({ message: "User Created and Logged In Successfully", user: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login endpoint with input validation
app.post("/api/login", async (req: Request, res: Response) => {
  try {
    const user = await usersCollection.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send({ message: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(req.body.password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET || "" // Use environment variable for JWT secret
    );

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({ message: "Login Successful", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout endpoint
app.post("/api/logout", (req: Request, res: Response) => {
    // Delete the token cookie by setting it to null and expiring it
    res.clearCookie("token", { httpOnly: true });

    res.status(200).json({ message: "Logout Successful" });
});

// Get user details
app.get("/api/user", auth, async (req: AuthRequest, res: Response) => {
try {
    if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User information missing" });
    }
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.toString()) });
    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User found", user: user })
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
}
});

// Verify if cookie user id is allowed in space
app.get("/api/verify", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: User information missing" });
    }
    const requestedUser = await usersCollection.findOne({ _id: new ObjectId(req.user.toString()) });
    const requestedSpace = await spacesCollection.findOne({ _id: new ObjectId(req.query.id?.toString()) });

    if (!requestedUser) {
        return res.status(404).json({ message: "User not logged in!" });
    }
    if (!requestedSpace) {
        return res.status(404).json({ message: "Space not found!" });
    }

    if (requestedUser._id.equals(requestedSpace.owner)) {
      return res.status(200).json({ message: "User verified", user: requestedUser, space: requestedSpace});
    }

    res.status(404).json({ message: "User not validated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/space/settings", auth, async (req: Request, res: Response) => {
  try {
    const space = await spacesCollection.findOne({ _id: new ObjectId(req.query.id?.toString()) });

    if (!space) {
      return res.status(404).json({ message: "Space not found" });
    }

    space.settings = req.body;

    await space.save();

    res.status(200).json({ message: "Space settings updated successfully", space });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get to-do lists for a user
app.get("/api/todo", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User information missing" });
    }

    const toDoLists = await toDosCollection.findOne({ owner: new ObjectId(req.user.toString()) });

    res.status(200).json(toDoLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update to-do lists for a user
app.post("/api/todo", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User information missing" });
    }
    // Find the user by their Id
    const toDoLists = await toDosCollection.findOne({ owner: new ObjectId(req.user.toString()) });

    if (!toDoLists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the specified list with the updatedSingleList
    toDoLists.tasks = req.body;

    // Save the updated toDoLists document
    await toDoLists.save();

    res.status(200).json({ message: "To-do list updated successfully", toDoLists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get notes for a user
app.get("/api/notes", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User information missing" });
    }
    const noteLists = await notesCollection.findOne({ owner: new ObjectId(req.user.toString()) });

    res.status(200).json(noteLists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update notes for a user
app.post("/api/notes", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User information missing" });
    }
    // Find the user by their Id
    const noteLists = await notesCollection.findOne({ owner: new ObjectId(req.user.toString()) });

    if (!noteLists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the specified list with the updatedSingleList
    noteLists.lists = req.body;

    // Save the updated noteLists document
    await noteLists.save();

    res.status(200).json({ message: "Note list updated successfully", noteLists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/campus", async (req: Request, res: Response) => {
  try {
    const courseInfo = await getCourseInfo(req.body.district, req.body.state, req.body.email, req.body.password);

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

    res.status(200).json(courseInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/stats", auth, async (req: AuthRequest, res: Response) => {
  try {
    const toDoStat = await toDosCollection.findOne({ owner: req.user });
    const noteStat = await notesCollection.findOne({ owner: req.user });
    const timerStat = await timersCollection.findOne({ owner: req.user });

    if (!toDoStat || !noteStat || !timerStat) {
      return res.status(404).json({ message: "User stats not found" });
    }

    res.status(200).json({ tasksCompleted: toDoStat.tasksCompleted, notesDownloaded: noteStat.notesDownloaded, timersFinished: timerStat.timersFinished });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/api/stats", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: User information missing" });
    }
    if (req.body.tasksCompleted) {
        const toDoStat = await toDosCollection.findOne({ owner: req.user });
        if (!toDoStat) {
            return res.status(404).json({ message: "User not found" });
        }
        toDoStat.tasksCompleted += req.body.tasksCompleted;
        await toDoStat.save();
        res.status(200).json({ message: "Stats updated successfully", tasksCompleted: toDoStat.tasksCompleted });
    }
    if (req.body.notesDownloaded) {
        const noteStat = await notesCollection.findOne({ owner: req.user });
        if (!noteStat) {
            return res.status(404).json({ message: "User not found" });
        }
        noteStat.notesDownloaded += req.body.notesDownloaded;
        await noteStat.save();
        res.status(200).json({ message: "Stats updated successfully", notesDownloaded: noteStat.notesDownloaded });
    }
    if (req.body.timersFinished) {
        const timerStat = await timersCollection.findOne({ owner: req.user });
        if (!timerStat) {
            return res.status(404).json({ message: "User not found" });
        }
        timerStat.timersFinished += req.body.timersFinished;
        await timerStat.save();
        res.status(200).json({ message: "Stats updated successfully", timersFinished: timerStat.timersFinished });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default app;
