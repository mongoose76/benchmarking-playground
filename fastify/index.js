const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

async function runQuery(q) {
  const client = await pool.connect();
  let res = {};

  try {
    res = await client.query(q);
  } catch (err) {
    console.log(err);
  } finally {
    client.release();
  }
  
  return res;
};

async function createTable() {
  const q = `CREATE TABLE IF NOT EXISTS public."Events" (
    id SERIAL,
    type VARCHAR(255),
    value INTEGER,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY(id)
  )
  WITH (oids = false);
  `;
  await runQuery(q);
}
async function deleteEvents() {
  const q = `
    TRUNCATE 
    public."Events"
  `;
  await runQuery(q);
};

async function insertEvent() {
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
    ) RETURNING "id","type","value","createdAt","updatedAt"
  `;

  return await runQuery(q);
};

createTable();
deleteEvents();

const fastify = require('fastify');
const app = fastify({ logger: false });
const port = 3000;

app.get('/', async (req, res) => {
  let r = await insertEvent();
  res.send({});
})

// Run the server!
const start = async () => {
  try {
    await app.listen(3000)
    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start();