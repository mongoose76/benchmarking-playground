const db = require("../db");
const jackpots = require("./jackpots");

async function addEvent(ev) {
  let res = await db.insertEvent(ev);
  let dbEv = res.rows[0].payload;
  dbEv.id = res.rows[0].id;
  console.log(JSON.stringify(dbEv));
  processEvent(dbEv);
  return dbEv;
}

function loadEventsFromDB() {
  // load all events from db and pass them to the process pipeline
  // for (ev in database events) {
  //   processEvent(ev); 
  // }
}

function processEvent(ev) {
  console.log("processing event " + JSON.stringify(ev));
  switch (ev.type) {
    case 'start':
      processStartEvent(ev);
      break;
    case 'contribute':
      processContributeEvent(ev);
      break;
    case 'redeem':
      processRedeemEvent(ev);
      break; 
  }
}

function processStartEvent(ev) {
  console.log("processing start event " + JSON.stringify(ev));
  let eventId = ev.id;
  let refs = ev.refs;
  jackpots.startJackpot(eventId, refs);
}

function processContributeEvent(ev) {
  console.log("processing contribute event " + JSON.stringify(ev));
  let refId = ev.refId;
  let value = ev.value;
  jackpots.contribute(refId, value);
}

function processRedeemEvent(ev) {
  console.log("processing redeem event " + JSON.stringify(ev));
  let eventId = ev.id;
  let refId = ev.refId;
  jackpots.redeemJackpot(eventId, refId);
}

loadEventsFromDB();

module.exports = {
    addEvent,
    loadEventsFromDB
}
