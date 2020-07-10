const db = require("./db/pg");

const memStore = require("./src/mem-store");

const fastify = require("fastify");
const app = fastify({ logger: false });
const port = 3000;

app.get("/refs/:refId", async (req, res) => {
  let refId = req.params.refId;
  let r = await db.getRefIdAggregateValue(refId);
  res.send(r);
});

app.get("/mrefs/:refId", async (req, res) => {
  let refId = req.params.refId;
  res.send(memStore.read(refId));
});

app.post("/events", async (req, res) => {
  let ev = req.body;
  let refId = ev.refId;
  let r = await db.insertEvent(refId, ev);
  if (ev.type === 'spin') {
    memStore.addVal(refId, ev.value);
  }
  res.status(201).send(r.rows[0]);
});

// Run the server!
const start = async () => {
  try {
    await db.dropTable();
    await db.createTable();
    await db.deleteEvents();

    await app.listen(port);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
