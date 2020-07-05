const dotenv = require('dotenv');

dotenv.config();

const { Sequelize, DataTypes, Model, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false });

class Event extends Model {}

Event.init({
  // Model attributes are defined here
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.INTEGER
    // allowNull defaults to true
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Event' // We need to choose the model name
});

// the defined model is the class itself
console.log(Event === sequelize.models.Event); // true

try {
  sequelize.sync({force: true});
} catch (err) {
  console.log(err);
}

const express = require('express');
const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  let ev = Event.build({ type: 'spin', value: 2 });
  let x = ev.save();
  await x;

  res.send({});
});

app.get('/raw', async (req, res) => {
  const q = `
    INSERT INTO 
    public."Events"
    (
      type,
      value,
      "createdAt",
      "updatedAt"
    )
    VALUES (
      'spin',
      2,
      now(),
      now()
    ) RETURNING "id","type","value","createdAt","updatedAt"
  `;
  const event = await sequelize.query(q, { type: QueryTypes.INSERT });

  res.send({});
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));