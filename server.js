const express = require('express');

const dotenv = require('dotenv').config();

const cors = require('cors');
const weather = require('./data/weather.json');

class Forecast { 
  constructor(description, date) {
  this.description = description;
  this.date = date;
  }
}

const weatherData = weather.data.map((obj) => {
  return new Forecast(obj.weather.description, obj.valid_date);
  }
);

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;
app.get('/weather', function (request, response) {
  const lat = request.query.lat
  const lon = request.query.lon
  response.send(weatherData);
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));