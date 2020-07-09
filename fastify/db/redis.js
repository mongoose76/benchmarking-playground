const Redis = require("ioredis");
const redis = new Redis("redis://localhost:6379"); // uses defaults unless given configuration object

// ioredis supports all Redis commands:
//redis.set("foo", "bar"); // returns promise which resolves to string, "OK"

// the format is: redis[SOME_REDIS_COMMAND_IN_LOWERCASE](ARGUMENTS_ARE_JOINED_INTO_COMMAND_STRING)
// the js: ` redis.set("mykey", "Hello") ` is equivalent to the cli: ` redis> SET mykey "Hello" `

// ioredis supports the node.js callback style
/*
redis.get("foo", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Promise resolves to "bar"
  }
});
*/

// All arguments are passed directly to the redis server:
//redis.set("key", 100, "EX", 10);

async function insertEvent() {
  let ev = {
    type: 'spin',
    value: 2,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime()
  };

  let res = await redis.xadd('events', '*',
           'type', 'spin',
           'value', 2);

  return res;
}

async function readEvent(id) {
  let res = await redis.xrange('events',
             id,
             '+',
             'COUNT', 5);
  return res;
}

module.exports = { 
  insertEvent,
  readEvent
}
