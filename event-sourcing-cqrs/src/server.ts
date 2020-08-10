import pino from "pino";
import fastify, { FastifyInstance } from "fastify";
import * as db from "./db";
import { AddressInfo } from "net";
import * as jackpots from "./jackpots";
import * as events from "./events";
import { setupRoutes } from "./routes";

const startTime = Date.now();

export const createServer = () => {
  const app: FastifyInstance = fastify({
    logger: pino({ level: 'info', prettyPrint: true })
  });
  app.server.keepAliveTimeout = 0;

  setupRoutes(app);

  return app;
}

const port = 3000;

// Run the server!
export const startServer = async (app: FastifyInstance) => {

  try {
    db.init(app.log);
    jackpots.init(app.log);
    events.init(db, jackpots, app.log);

    // load events from DB then start the server
    await events.loadEvents();

    if (jackpots.getAll().length === 0) {
      app.log.info("Starting jackpots ...");

      let startJackpotEvent = {
        type: 'start',
        refs: ['A', 'C']
      }
      await events.addEvent(startJackpotEvent);

      startJackpotEvent = {
        type: 'start',
        refs: ['B', 'D']
      }
      await events.addEvent(startJackpotEvent);
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

export const stopServer = async (app: FastifyInstance) => {
  try {
    app.server.close();
    app.log.info("server closed");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};