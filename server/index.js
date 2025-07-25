// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.post('/register', async (req, res) => {
  const { name, email, interests } = req.body;
  try {
    await db.query(
      'INSERT INTO students (name, email, interests) VALUES ($1, $2, $3)',
      [name, email, interests]
    );
    res.status(201).send('Registered');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error');
  }
});

app.get('/count', async (req, res) => {
  const result = await db.query('SELECT COUNT(*) FROM students');
  res.json({ count: result.rows[0].count });
});

app.listen(3000, () => console.log('Server running on port 3000'));
