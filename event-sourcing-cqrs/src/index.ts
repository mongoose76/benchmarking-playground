const startTime = Date.now();
import pino from "pino";
import fastify, { FastifyInstance } from "fastify";
import * as db from "./db";
import { AddressInfo } from "net";
import * as jackpots from "./jackpots";
import * as events from "./events";
import { setupRoutes } from "./routes";

const app: FastifyInstance = fastify({
  logger: pino({ level: 'info', prettyPrint: true })
});
const port = 3000;

app.server.keepAliveTimeout = 0;

db.init(app.log);
jackpots.init(app.log);
events.init(db, jackpots, app.log);
setupRoutes(app);

// Run the server!
const start = async () => {
  try {
    if (jackpots.getAll().length === 0) {
      app.log.info("Starting jackpots ...");

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

    await app.listen(port, "0.0.0.0");
    app.log.info(`server listening on ${(app.server.address() as AddressInfo).port}`);
    const endTime = Date.now();
    app.log.info(`startup time ${endTime - startTime}ms`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// load events from DB then start the server
events.loadEvents().then(() => start());