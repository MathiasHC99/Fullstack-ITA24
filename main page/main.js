const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// MongoDB Connection
const uri = "mongodb://localhost:27017"; // Replace with your MongoDB URI
const client = new MongoClient(uri);
const databaseName = "eventPlanner";

let eventsCollection;

// Connect to MongoDB and set up the collection
async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(databaseName);
        eventsCollection = db.collection("events");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

connectDB();

// Routes

// Get all events
app.get("/events", async (req, res) => {
    try {
        const events = await eventsCollection.find({}).toArray();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single event by ID
app.get("/events/:id", async (req, res) => {
    try {
        const event = await eventsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new event
app.post("/events", async (req, res) => {
    try {
        const result = await eventsCollection.insertOne(req.body);
        res.status(201).json(result.ops[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update an event by ID
app.put("/events/:id", async (req, res) => {
    try {
        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an event by ID
app.delete("/events/:id", async (req, res) => {
    try {
        const result = await eventsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// ved ikke om det virker, min computer driller