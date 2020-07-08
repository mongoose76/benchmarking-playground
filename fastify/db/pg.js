const dotenv = require('dotenv');
dotenv.config();

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: process.env.DATABASE_MAX_CONN,
});

async function query(sql) {
  const connection = await pool.connect();
  let res;

  try {
    res = await connection.query(sql);
  } catch (err) {
    console.log(err);
  } finally {
    await connection.release();
  }

  return res;
}

async function createTable() {
  const sql = `CREATE TABLE IF NOT EXISTS public."Events" (
    id SERIAL,
    type VARCHAR(255),
    value INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY(id)
)
WITH (oids = false);
`;
  await query(sql);
}

async function deleteEvents() {
  const sql = `TRUNCATE public."Events"`;
  await query(sql);
}

async function insertEvent() {
  const sql = `
      INSERT INTO 
      public."Events"
      (
        "type", "value", "createdAt", "updatedAt"
      )
      VALUES (
        'spin', 2, now(), now()
      ) RETURNING "id", "type", "value", "createdAt", "updatedAt"
    `;

  return await query(sql);
}

module.exports = { 
  deleteEvents, 
  insertEvent, 
  createTable 
}