const dotenv = require('dotenv');
dotenv.config();

const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = 'mongodb://localhost:27017';

var dbOptions = { 
  useNewUrlParser: true, 
  useUnifiedTopology: true, 
  auto_reconnect: true, 
  poolSize: 50,
};
var _db;

// Initialize connection once
MongoClient.connect(url, dbOptions, function(err, client) {
  if(err) throw err;
  _db = client.db('jackpot');
  _db.collection('events').deleteMany({});
});

async function insertOne(obj) {
  let res;
  try {
      res = await _db.collection('events').insertOne(obj);
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