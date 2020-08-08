import dotenv from "dotenv";
import { Pool } from "pg";
import Cursor from "pg-cursor";
import FastJsonStringify = require("fast-json-stringify");

dotenv.config();

let logger;
export function init(appLogger) {
  logger = appLogger;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.DATABASE_MAX_CONN),
  connectionTimeoutMillis: Number(process.env.DATABASE_CONNECTION_TIMEOUT),
  idleTimeoutMillis: Number(process.env.DATABASE_IDLE_TIMEOUT),
});


const eventSchema: FastJsonStringify.Schema = {
  title: 'Event Schema',
  type: 'object',
  properties: {
    type: {
      description: 'Event Type',
      type: 'string'
    },
    refId: {
      'description': 'Jackpot Ref Id',
      type: 'string'
    },
    refs: {
      description: 'Jackpot start refs array',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    value: {
      description: 'Event value',
      type: 'integer'
    },
    userId: {
      description: 'User Id',
      type: 'integer'
    }
  }
}

const jsonStringify = FastJsonStringify(eventSchema);

async function query(sql) {
  const connection = await pool.connect();
  // pool.waitingCount > 0 ? logger.warn(`pg pool state: totalCount ${pool.totalCount} idle ${pool.idleCount} waiting ${pool.waitingCount}`) : null;
  let res;

  try {
    res = await connection.query(sql);
  } catch (err) {
    logger.error(err);
  } finally {
    try {
      connection.release();
    } catch (err) {
      logger.error(err);
    }
  }

  logger.trace(res);
  return res;
}

function readCursor(cursor, count): Promise<any[]> {
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
export async function loadEvents(processFn) {
  logger.info("Loading events from DB ...");
  const connection = await pool.connect();
  const CHUNK_SIZE = 500000;
  try {
    const text = 'SELECT id, payload FROM "Events" ORDER BY id ASC';
    const cursor = connection.query(new Cursor(text));
    let idx = 0;
    do {
      const rows: any[] = await readCursor(cursor, CHUNK_SIZE);
      rows.forEach(row => {
        const dbEv = row.payload;
        dbEv.id = row.id;
        processFn(dbEv);
      });
      logger.info(`Loaded events ${(idx * CHUNK_SIZE).toLocaleString()} to ${(idx * CHUNK_SIZE + rows.length).toLocaleString()}`);
      if (rows.length < CHUNK_SIZE) {
        break;
      }
      idx++;
    } while (true);
  } finally {
    connection.release();
  }
}

export async function dropTable() {
  const sql = `DROP TABLE IF EXISTS "Events"`;
  await query(sql);
}

export async function createTable() {
  let sql = `CREATE TABLE IF NOT EXISTS "Events" (
    id SERIAL,
    payload JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT "Events_pkey" PRIMARY KEY(id)
  )
  WITH (oids = false);`;
  await query(sql);

  sql = `CREATE INDEX IF NOT EXISTS idx_refid ON "Events" ((payload->>'refId'))`;
  await query(sql);

  sql = `CREATE INDEX IF NOT EXISTS idx_value ON "Events" ((payload->>'type'))`;
  await query(sql);
}

export async function deleteEvents() {
  const sql = `TRUNCATE "Events"`;
  await query(sql);
}

export async function getRefIdAggregateValue(refId) {
  const sql = `select sum(CAST(payload ->> 'value' AS INTEGER)) AS val from  "Events"
                WHERE payload ->> 'refId' = '${refId}' AND payload ->> 'type' = 'spin'`;
  const res = await query(sql);
  return res.rows[0].val;
}

export async function insertEvent(ev) {
  const sql = `
      INSERT INTO
      "Events"
      (
        "payload", "createdAt"
      )
      VALUES (
        '${jsonStringify(ev)}', now()
      ) RETURNING "id", "payload", "createdAt"`;

  const res = await query(sql);
  return {
    id: res.rows[0].id,
    ... res.rows[0].payload
  };
}
