// external imports
import editDB from "./dbEdit";
import * as mongodb from "mongodb";
import * as dotenv from "dotenv";
dotenv.config();

export default class Database {
    public collections: DatabaseCollections = {} as DatabaseCollections;

    constructor() {
        this.dbConnect();
    }

    private async dbConnect() {
        // use MongoClient to connect this app to our database on mongoDB using the DB_URL (connection string)
        console.log("Started");
        if (!process.env.DB_URL) {
            console.error("DB_URL is not set. Please set it in the .env file");
            process.exit(1);
        }
        const client = new mongodb.MongoClient(process.env.DB_URL);

        try {
            // Connect to the MongoDB cluster
            await client.connect();
            console.log("Successfully connected to MongoDB Atlas!");

            const database = client.db("main");

            // Create the collections
            this.collections.spaces = database.collection("spaces");
            this.collections.users = database.collection("users");
            this.collections.views = {
                notes: database.collection("notes"),
                toDos: database.collection("toDos"),
                timer: database.collection("timer"),
            };

            // editDB()
        } catch (error) {
            console.log("Unable to connect to MongoDB Atlas!");
            console.error(error);
        }
    }
}

interface DatabaseCollections {
    spaces: mongodb.Collection;
    users: mongodb.Collection;
    views: {
        notes: mongodb.Collection;
        toDos: mongodb.Collection;
        timer: mongodb.Collection;
    }
}
