'use strict';

const superagent = require('superagent');
require('dotenv').config();
let cache = require('./cache');

function weatherHandler(request, response) {
  const { lat, lon } = request.query;
  getWeather(lat, lon)
    .then(summaries => response.send(summaries))
    .catch((error) => {
      console.error(error);
      response.status(500).send('Sorry. Something went wrong!')
  });
}  

function getWeather(latitude, longitude) {
  console.log('here')
  const key = 'weather-' + latitude + longitude;
  
  const url = 'http://api.weatherbit.io/v2.0/forecast/daily';
  const queryParams = {
    key: process.env.WEATHER_API_KEY,
    lang: 'en',
    lat: latitude,
    lon: longitude,
    days: 5,
  };
  
  if (cache[key] !== undefined && (Date.now() - cache[key].timestamp < 43200)) {
    //holds data for 12 hours so the forecast gets updated twice daily
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url)
    .query(queryParams)
    .then(response => parseWeather(response.body));
  }
  
  return cache[key].data;
}

function parseWeather(weatherData) {
  try {
    const weatherSummaries = weatherData.data.map(day => {
      return new Weather(day);
    });
    return Promise.resolve(weatherSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

class Weather {
  constructor(day) {
    this.description = day.weather.description;
    this.date = day.datetime;
  }
}

module.exports = weatherHandler;