// server/index.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required by Render
});

app.post('/register', async (req, res) => {
  const { name, email, interests } = req.body;
  if (!name || !email || !interests || !interests.length) {
    return res.status(400).send('Missing required fields');
  }
  try {
    await db.query(
      'INSERT INTO students (name, email, interests) VALUES ($1, $2, $3)',
      [name, email, interests]
    );
    res.status(201).send('Registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error saving to database');
  }
});

app.get('/count', async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) FROM students');
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    res.status(500).send('Error fetching count');
  }
});

app.get('/students', async (req, res) => {
  const { admin } = req.query;
  if (admin !== 'code3admin') return res.status(401).send('Unauthorized');
  try {
    const result = await db.query('SELECT * FROM students ORDER BY registered_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching students');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
