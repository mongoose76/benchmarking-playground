const db = require("./db");

const events = require("./src/events");
const jackpots = require("./src/jackpots");

const fastify = require("fastify");
const app = fastify({ logger: false });
const port = 3000;

app.get("/jackpots", async (req, res) => {
  res.send(jackpots.getAll());
});

app.get("/jackpots/:refId", async (req, res) => {
  let refId = req.params.refId;
  res.send(jackpots.getByRefId(refId));
});

app.get("/jackpots/:refId/raw", async (req, res) => {
  let refId = req.params.refId;
  let r = await db.getRefIdAggregateValue(refId);
  res.send(r);
});

app.post("/events", async (req, res) => {
  let ev = req.body;
  let r = events.addEvent(ev);
  res.status(201).send(r);
});

// Run the server!
const start = async () => {
  try {
    //await db.dropTable();
    //await db.createTable();
    //await db.deleteEvents();

    if (jackpots.getAll().length === 0) {
      console.log("Starting jackpots ...");

      let startJackpotEvent = {
        type: 'start',
        refs: ['A', 'C']
      }
      events.addEvent(startJackpotEvent);
      
      startJackpotEvent = {
        type: 'start',
        refs: ['B', 'D']
      }
      events.addEvent(startJackpotEvent);
    }

    await app.listen(port);
    app.log.info(`server listening on ${app.server.address().port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
events.loadEvents().then(() => start());
