const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.DATABASE_URL_MYSQL);
let pool = mysql.createPool(process.env.DATABASE_URL_MYSQL);

async function runQuery(q) {
  const conn = await pool.getConnection();  
  let res = {};

  try {
    res = await conn.query(q);
  } catch (err) {
    console.log(err);
  } finally {
    conn.release();
  }
  
  return res;
};

async function createTable() {
  const q = `
  CREATE TABLE IF NOT EXISTS \`Events\` (
    \`id\` BIGINT NOT NULL AUTO_INCREMENT,
    \`type\` VARCHAR(255) NOT NULL,
    \`value\` INTEGER(11) NOT NULL,
    \`createdAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    \`updatedAt\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id\`)
  ) ENGINE=InnoDB
  `;
  await runQuery(q);
}
async function deleteEvents() {
  const q = `
    TRUNCATE 
    \`Events\`
  `;
  await runQuery(q);
};

async function insertEvent() {
  const q = `
    INSERT INTO 
    \`Events\`
    (
      type,
      value,
      createdAt,
      updatedAt
    )
    VALUES (
      'spin',
      2,
      CURRENT_TIMESTAMP,
      CURRENT_TIMESTAMP
    )
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
    await app.listen(port)
    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}
start();