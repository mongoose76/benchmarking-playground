module.exports = function(app) {
  const assert = require("assert");

  let Jackpot = class {
    constructor(id, refs) {
      assert(id !== undefined);
      assert(Array.isArray(refs));
      this.id = id;
      this.refs = refs;
      this.value = 0;
    }

    addContribution(val) {
      app.log.debug("addContribution for jackpot id " + this.id);
      this.value += val;
    }

    toJSON() {
      return {
        id: this.id,
        refs: this.refs,
        value: this.value
      }
    }
  };

  const jackpots = [];

  function startJackpot(eventId, refs) {
    jackpots.push(new Jackpot(eventId, refs));
  }

  function contribute(refId, value) {
    for (j of jackpots) {
      app.log.debug("does " + j.refs + " include " + refId);
      if (j.refs.includes(refId)) {
        app.log.debug("it does!");
        j.addContribution(value);
      }
    }
  }

  function redeem(eventId, refId) {
    // TODO
  }

  function getByRefId(refId) {
    return jackpots.filter(j => j.refs.includes(refId)).map(j => j.toJSON());
  }

  function getAll() {
    let res = jackpots.map(j => j.toJSON());
    app.log.debug(JSON.stringify(res));
    return res;
  }

  return {
    startJackpot,
    contribute,
    redeem,
    getByRefId,
    getAll
  }
}