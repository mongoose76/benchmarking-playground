import pino from "pino";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { describe, before, after, beforeEach, afterEach, it } from "mocha";
import { createServer, startServer, stopServer } from "../src/server";
import * as db from "../src/db";

chai.use(chaiHttp);
const serverUrl = "http://127.0.0.1:3000";
db.init(pino({ level: 'info', prettyPrint: true }));
const app = createServer();

describe("jackpots", () => {

    before(async () => {
        await db.query(`TRUNCATE TABLE "Events";`);
        await startServer(app);
    });

    after(async () => {
        await stopServer(app);
    });

    beforeEach(async () => {
        const res = await db.query(`SELECT count(id) as event_count FROM "Events";`);
        app.log.warn(`=====> events count: ${res.rows[0].event_count}`);
    });

    afterEach(async () => {
        // emtpy
    });

    it("/jackpots - returns initial jackpot values", async () => {
        const result = await chai.request(serverUrl).get("/jackpots");
        const expected = [
            {"id":1,"refs":["A","C"],"value":0},
            {"id":2,"refs":["B","D"],"value":0}
        ];

        app.log.warn("======> result ", result.body);

        expect(result.status).to.be.equal(200);
        expect(result.body).to.deep.equal(expected);
    });

    it("/jackpots - contribute event works as expected", async () => {
        const ev = {
            type: "contribute",
            refId: "A",
            value: 10
        };
        const postResult = await chai.request(serverUrl).post("/events").send(ev);
        expect(postResult.status).to.be.equal(201);

        const getResult = await chai.request(serverUrl).get("/jackpots");
        const expected = [
            {"id":1,"refs":["A","C"],"value":10},
            {"id":2,"refs":["B","D"],"value":0}
        ];
        expect(getResult.status).to.be.equal(200);
        expect(getResult.body).to.deep.equal(expected);
    });
});