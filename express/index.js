const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function query() {
  const q = `
  INSERT INTO 
  public."Events"
  (
    type,
    value,
    "createdAt",
    "updatedAt"
  )
  VALUES (
    'spin',
    2,
    now(),
    now()
  )`
  try {
    return pool.query(q);
  } catch (err) {
    console.log(err);
  }
  
  return {};
};

const express = require('express');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const { id } = req.params;
  const { command } = await query();
  res.send(command);
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));