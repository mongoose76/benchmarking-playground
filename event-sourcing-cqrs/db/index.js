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
    connection.release();
  }

  return res;
}

async function dropTable() {
  let sql = `DROP TABLE IF EXISTS "Events"`;
  await query(sql);
}

async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS "Events" (
    id SERIAL,
    payload JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY(id)
  )
  WITH (oids = false);`;
  await query(sql);

  sql = `CREATE INDEX idx_refid ON "Events" ((payload->>'refId'))`;
  await query(sql);

  sql = `CREATE INDEX idx_value ON "Events" ((payload->>'type'))`;
  await query(sql);
}

async function deleteEvents() {
  const sql = `TRUNCATE "Events"`;
  await query(sql);
}

async function getRefIdAggregateValue(refId) {
  const sql = `select sum(CAST(payload ->> 'value' AS INTEGER)) AS val from  "Events" 
                WHERE payload ->> 'refId' = '${refId}' AND payload ->> 'type' = 'spin'`;
  let res = await query(sql);
  //console.log(res);
  return res.rows[0].val;
}
async function insertEvent(ev) {
  const sql = `
      INSERT INTO 
      "Events"
      (
        "payload", "createdAt"
      )
      VALUES (
        '${JSON.stringify(ev)}', now()
      ) RETURNING "id", "payload", "createdAt"
    `;

  return await query(sql);
}

module.exports = {
  dropTable,
  createTable,
  deleteEvents, 
  insertEvent,
  getRefIdAggregateValue
}