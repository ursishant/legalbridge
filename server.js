// Simple Express backend for storing contact data and blog posts
// This file is not run in the current environment but provided as a reference
// for how you could implement persistence using SQLite.

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialise SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organisation TEXT,
    name TEXT,
    phone TEXT,
    timestamp TEXT
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    date TEXT,
    summary TEXT,
    content TEXT
  )`);
});

// Endpoint to record contact
app.post('/api/contact', (req, res) => {
  const { organisation, name, phone, timestamp } = req.body;
  if (!organisation || !name || !phone) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  db.run('INSERT INTO contacts (organisation, name, phone, timestamp) VALUES (?, ?, ?, ?)', [organisation, name, phone, timestamp || new Date().toISOString()], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Contact recorded', id: this.lastID });
  });
});

// Endpoints to manage blog posts
app.get('/api/blogs', (req, res) => {
  db.all('SELECT * FROM blogs ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/api/blogs/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM blogs WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  });
});

app.post('/api/blogs', (req, res) => {
  const { title, author, date, summary, content } = req.body;
  if (!title || !author || !date || !summary || !content) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  db.run('INSERT INTO blogs (title, author, date, summary, content) VALUES (?, ?, ?, ?, ?)', [title, author, date, summary, content], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Blog created', id: this.lastID });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});