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
client.connect()
    .then(() => {
        console.log("Connected to MongoDB");
        const db = client.db(databaseName);
        eventsCollection = db.collection("events");
    })
    .catch((err) => console.error("Failed to connect to MongoDB", err));

// Routes

// 1. Get all events
app.get("/events", async (req, res) => {
    try {
        const events = await eventsCollection.find({}).toArray();
        res.send(events);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 2. Get a single event by ID
app.get("/events/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await eventsCollection.findOne({ _id: new ObjectId(eventId) });
        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }
        res.send(event);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 3. Create a new event
app.post("/events", async (req, res) => {
    try {
        const newEvent = req.body;
        const result = await eventsCollection.insertOne(newEvent);
        res.status(201).send(result.ops[0]);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 4. Update an event by ID
app.put("/events/:id", async (req, res) => {
    try {
        const eventId = req.params.id;
        const updatedEvent = req.body;

        const result = await eventsCollection.updateOne(
            { _id: new ObjectId(eventId) },
            { $set: updatedEvent }
        );

        if (result.matchedCount === 0) {
            return res.status(404).send({ message: "Event not found" });
        }

        res.send({ message: "Event updated successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// 5. Delete an event by ID
app.delete("/events/:id", async (req, res) => {
    try {
        const eventId = req.params.id;

        const result = await eventsCollection.deleteOne({ _id: new ObjectId(eventId) });

        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "Event not found" });
        }

        res.send({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
