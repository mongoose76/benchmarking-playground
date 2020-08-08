import * as jackpots from "./jackpots";
import * as db from "./db";
import * as events from "./events";
import { FastifyInstance } from "fastify";

export function setupRoutes(app: FastifyInstance) {
  let requestCount = 0;
  app.addHook('onRequest', (request, reply, done) => {
    if (++requestCount % 100000 === 0) {
      app.log.warn(`${requestCount} requests processed ====== `);
    }
    done();
  });

  app.get("/jackpots", { logLevel: "warn" }, async (req, res) => {
    res.send(jackpots.getAll());
  });

  app.get("/jackpots/:refId", { logLevel: "warn" }, async (req, res) => {
    const refId = req.params.refId;
    res.send(jackpots.getByRefId(refId));
  });

  app.get("/jackpots/:refId/raw", { logLevel: "warn" }, async (req, res) => {
    const refId = req.params.refId;
    const r = await db.getRefIdAggregateValue(refId);
    res.send(r);
  });

  app.post("/events", { logLevel: "warn" }, async (req, res) => {
    const ev = req.body;
    try {
      const r = events.addEvent(ev);
      res.status(201).send(r);
    } catch (err) {
      app.log.error(err);
      res.status(500).send(err);
    }
  });
}
