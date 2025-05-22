require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
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
    const sql = 'SELECT * FROM documents ORDER BY id DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Fetch error:', err);
            return res.status(500).send('Error fetching documents');
        }
        res.json(results);
    });
});


// Fetch all or searched documents
app.get('/documentsbySearch', (req, res) => {
    const search = req.query.search;
    let query = 'SELECT * FROM documents';
    let params = [];

    if (search) {
        query += ' WHERE title LIKE ?';
        params.push(`%${search}%`);
    }

    db.query(query, params, (err, rows) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(rows);
    });
});

// Get a single document by ID
app.get('/document/:id', (req, res) => {
    const documentId = req.params.id;

    const sql = 'SELECT * FROM documents WHERE id = ?';
    db.query(sql, [documentId], (err, results) => {
        if (err) {
            console.error('Error fetching document:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.json(results[0]); // Return the single document
    });
});

// Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  const { title, category, description, uploaderName, price} = req.body;
  const fileSize = parseInt(req.body.fileSize, 10);
  const file = req.file;

  if (!file || !title || !description || !uploaderName || !category || !fileSize || !price) {
      return res.status(400).json({ message: 'All fields including uploader name are required' });
  }

    // Construct the file path for the database
    const filePath = `/uploads/${file.filename}`; // The file path accessible through the server

    // Insert the document into the database
    const sql = `INSERT INTO documents (title, category, description, filename, filepath, uploaderName, fileSize, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [title, category, description, file.filename, filePath, uploaderName, fileSize, price];

    db.query(sql, values, (err, result) => {
        if (err) {
      console.error('DB Insert Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    return res.status(200).json({ message: 'Document uploaded', documentId: result.insertId });
  });
});


app.post('/increment-download', (req, res) => {
    const { id } = req.body;

    if (!id) {
        console.log("Missing ID in request body");
        return res.status(400).json({ message: 'Missing document ID' });
    }

    const sql = 'UPDATE documents SET download_count = download_count + 1 WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Optional: check if any row was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        console.log(`Download count incremented for document ID: ${id}`);
        res.status(200).json({ message: 'Download count incremented' });
    });
});  

app.post('/increment-view', (req, res) => {
  const { id } = req.body;
  if (!id) {
        console.log("Missing ID in request body");
        return res.status(400).json({ message: 'Missing document ID' });
    }
   const sql = 'UPDATE documents SET view_count = view_count + 1 WHERE id = ?';
   db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database update error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Optional: check if any row was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Document not found' });
        }

        console.log(`View count incremented for document ID: ${id}`);
        res.status(200).json({ message: 'View count incremented' });
    });
});

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if email already exists (optional but recommended)
    const checkSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user into the database
      const insertSql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
      const values = [username, email, hashedPassword];

      db.query(insertSql, values, (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/documents', (req, res) => {
  db.query('SELECT * FROM documents ORDER BY id DESC', (err, results) => {
    if (err) {
      console.error('Error fetching documents:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});
  
  // Login Route
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    try {
      const sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email], async (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
  
        if (results.length === 0) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
  
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
          res.status(200).json({ 
          message: 'Login successful', 
          token,
          id: user.id,
          username: user.username,
          email: user.email
          
        });
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });  
  
  

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
