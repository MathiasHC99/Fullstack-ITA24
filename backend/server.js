require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Route to fetch events
app.get('/api/events', (req, res) => {
    const query = 'SELECT * FROM events';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).json({ message: 'Error fetching events' });
        }
        res.json(results);
    });
});

// Route to create an event
app.post('/api/events', (req, res) => {
    const { title, description, date, time, location } = req.body;
    const query = 'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [title, description, date, time, location], (err, results) => {
        if (err) {
            console.error('Error creating event:', err);
            return res.status(500).json({ message: 'Error creating event' });
        }
        res.status(201).json({ success: true, id: results.insertId });
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
