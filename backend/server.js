const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sys123',
    database: 'smartnotes_db'
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection error:', err);
    } else {
        console.log('MySQL connected!');
    }
});

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Fetch all documents from the database
app.get('/documents', (req, res) => {
    const sql = 'SELECT * FROM documents';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Fetch error:', err);
            return res.status(500).send('Error fetching documents');
        }
        res.json(results);
    });
});

app.get('/test', (req, res) => {
    res.status(200).json({ message: 'Test API is working!' });
});

// Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
    const { title, description } = req.body;
    const file = req.file;

    if (!file || !title || !description) {
        return res.status(400).json({ message: 'All fields required' });
    }

    // Construct the file path for the database
    const filePath = `/uploads/${file.filename}`; // The file path accessible through the server

    // Insert the document into the database
    const sql = "INSERT INTO documents (title, description, filename, filepath) VALUES (?, ?, ?, ?)";
    const values = [title, description, file.filename, filePath];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('DB Insert Error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(200).json({ message: 'Document uploaded', documentId: result.insertId });
    });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
