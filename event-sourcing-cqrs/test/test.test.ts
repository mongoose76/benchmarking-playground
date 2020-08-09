import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { describe, before, after, beforeEach, afterEach, it } from "mocha";
import { createServer, startServer, stopServer } from "../src/index";
import * as db from "../src/db";

chai.use(chaiHttp);

describe("jackpots", () => {
    let app = createServer();

    before(async () => {
        await startServer(app);
    });

    after(async () => {
        await stopServer(app);
    });

    beforeEach(async () => {
        
    });

    afterEach(async () => {
        // Clear events
        await db.query(`TRUNCATE TABLE "public.Events";`);
    });

    it("/jackpots - returns all jackpots values", async () => {
        const result = await chai.request("localhost:3000").get(`/jackpots`).send();
        console.log(result);

        expect(result.status).to.be.equal(200);
    });
});