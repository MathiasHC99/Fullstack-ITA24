require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());

// MySQL database connection using environment variables
const db = mysql.createConnection({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME
});

// Connect to the MySQL database
db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// API Route: Get all events
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

// API Route: Create a new event
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

// Start the server using the PORT from the .env file
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
