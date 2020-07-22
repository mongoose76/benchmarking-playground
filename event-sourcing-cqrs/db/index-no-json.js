const { user } = require('pg/lib/defaults');

module.exports = function(app) {
  const dotenv = require('dotenv');
  dotenv.config();

  const { Pool } = require("pg");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: process.env.DATABASE_MAX_CONN,
  });

  const Cursor = require('pg-cursor');

  async function query(sql) {
    const connection = await pool.connect();
    let res;
    app.log.debug(sql);
    try {
      res = await connection.query(sql);
    } catch (err) {
      app.log.error(err);
    } finally {
      connection.release();
    }

    app.log.trace(res);
    return res;
  }

  function readCursor(cursor, count) {
    return new Promise((resolve, reject) => {
        cursor.read(count, (err, rows, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(rows);
        });
    });
  }

  // load all events from db and pass them to the process pipeline
  async function loadEvents(processFn) {
    app.log.info("Loading events from DB ...");
    const connection = await pool.connect();
    const CHUNK_SIZE = 500000;
    try {
      const text = 'SELECT * FROM "Events" ORDER BY "id" ASC';
      const cursor = connection.query(new Cursor(text));
      let idx = 0;
      do {
        const rows = await readCursor(cursor, CHUNK_SIZE);        
        rows.forEach(row => {
          processFn(row);          
        });
        app.log.info(`Loaded events ${(idx * CHUNK_SIZE).toLocaleString()} to ${(idx * CHUNK_SIZE + rows.length).toLocaleString()}`);
        if (rows.length < CHUNK_SIZE) {
          break;
        }
        idx++;
      } while (true);
    } finally {
      connection.end();
    }
  }

  async function dropTable() {
    let sql = `DROP TABLE IF EXISTS "Events"`;
    await query(sql);
  }

  async function createTable() {
    let sql = `CREATE TABLE IF NOT EXISTS "Events" (
      id SERIAL,
      "userId" INTEGER,
      "type" VARCHAR(50),
      "refId" VARCHAR(50),
      "refs" VARCHAR(50)[],
      "value" INTEGER,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
      CONSTRAINT "Events_pkey" PRIMARY KEY(id)
    )
    WITH (oids = false);`;
    await query(sql);

    sql = `CREATE INDEX IF NOT EXISTS idx_refid ON "Events" ("refId")`;
    await query(sql);

    sql = `CREATE INDEX IF NOT EXISTS idx_value ON "Events" (type)`;
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
    return res.rows[0].val;
  }

  function quotes(x) {
    if (Array.isArray(x)) {
      return "'{" + x.join(',') + "}'";
    } else if (x === undefined) {
      return 'NULL';
    } else {
      return "'" + x + "'";
    }    
  }

  async function insertEvent(ev) {
    let userId = ev.userId || 'NULL';
    let type = ev.type;
    let refId = ev.refId;
    let refs = ev.refs;
    let value = ev.value || 'NULL';

    const sql = `
        INSERT INTO 
        "Events"
        (
          "userId", "type", "refId", "refs", "value", "createdAt"
        )
        VALUES (
          ${userId}, ${quotes(type)}, ${quotes(refId)}, ${quotes(refs)}, ${value}, now()
        ) RETURNING "id", "userId", "type", "refId", "refs", "value", "createdAt"`;

    let res = (await query(sql));
    return {
      ... res.rows[0]
    };
  }

  return {
    loadEvents,
    dropTable,
    createTable,
    deleteEvents, 
    insertEvent,
    getRefIdAggregateValue
  }
}