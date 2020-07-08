const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

var db;

// Initialize connection once
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 100 }, function(err, client) {
  if(err) throw err;
  db = client.db('jackpot');
  //console.log(db);

  let collection = db.collection('events');
  collection.deleteMany({});
});

async function insertOne(obj) {
  let res;
  try {
      let collection = db.collection('events');
      res = await collection.insertOne(obj);
      //console.log(res);
  } catch (err) {
      console.log(err);
  }
  return res;
}

async function insertEvent() {
  let ev = {
    type: 'spin',
    value: 2,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  };
  let res = await insertOne(ev);
  return res;
}

module.exports = { 
  insertEvent 
}