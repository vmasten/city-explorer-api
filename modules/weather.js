'use strict';

const superagent = require('superagent');


function getWeather (request, response) {
  const lat = request.query.lat
  const lon = request.query.lon
  
  superagent.get(`${process.env.WEATHER_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`)
    .then(res => {
      const currentWeather = res.body
      const weatherData = currentWeather.data.map((obj) => {
        return new Forecast(obj.weather.description, obj.valid_date);
      });
      response.status(200).send(weatherData);
    })
    .catch(err => {
      console.log('superagent failed');
      response.status(500).send('kerplode! something broke on our end :(')
    })
}

class Forecast { 
  constructor(description, date) {
  this.description = description;
  this.date = date;
  }
}

module.exports = getWeather;