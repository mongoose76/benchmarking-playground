const db = require("./db");

const fastify = require("fastify");
const app = fastify({ logger: false });
const port = 3000;

app.get("/", async (req, res) => {
  let r = await db.insertEvent();
  res.send(r.rows[0]);
});

// Run the server!
const start = async () => {
  try {
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
