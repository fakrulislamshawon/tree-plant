const express = require('express');
const mysql = require("mysql");
const bodyparser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5501;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500'  // Allow requests from your frontend
}));
app.use(bodyparser.json());
app.use(express.static('public')); // For serving static files if needed

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',      // MySQL server (localhost for local)
    user: 'root',           // MySQL username (root in your case)
    password: '',           // MySQL password (empty here)
    database: 'student'   // Your database name
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to database:', err); // Log connection errors
        throw err;
    }
    console.log('Connected to the MySQL database!');
});

// Endpoint to handle contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, number, message } = req.body;

    // Log the form data to the console
    console.log('Received message:', req.body);

    // Insert the message into the contact_messages table
    const sql = 'INSERT INTO contact_messages (name, email, number, message) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, number, message], (err, result) => {
        if (err) {
            console.error('Error inserting message:', err); // Log the error
            return res.status(500).send('Error saving message.');
        }
        console.log('Message saved to the database, ID:', result.insertId); // Log success
        res.status(201).send('Message saved successfully!');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
