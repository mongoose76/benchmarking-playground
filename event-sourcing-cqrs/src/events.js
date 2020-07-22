module.exports = function(app, db, jackpots) {

  async function addEvent(ev) {
    let res = await db.insertEvent(ev);
    let dbEv = res.rows[0].payload;
    dbEv.id = res.rows[0].id;
    app.log.debug(JSON.stringify(dbEv));
    processEvent(dbEv);
    return dbEv;
  }

  function processEvent(ev) {
    app.log.debug("processing event " + JSON.stringify(ev));
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

  async function loadEvents() {
    await db.createTable();
    return db.loadEvents(processEvent);
  }

  function processStartEvent(ev) {
    app.log.debug("processing start event " + JSON.stringify(ev));
    let eventId = ev.id;
    let refs = ev.refs;
    jackpots.startJackpot(eventId, refs);
  }

  function processContributeEvent(ev) {
    app.log.debug("processing contribute event " + JSON.stringify(ev));
    let refId = ev.refId;
    let value = ev.value;
    jackpots.contribute(refId, value);
  }

  function processRedeemEvent(ev) {
    app.log.debug("processing redeem event " + JSON.stringify(ev));
    let eventId = ev.id;
    let refId = ev.refId;
    jackpots.redeem(eventId, refId);
  }

  return {
    addEvent,
    loadEvents
  }    
}