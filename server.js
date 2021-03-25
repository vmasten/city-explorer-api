'use strict'

const express = require('express');
const app = express();
const cors = require('cors');
const superagent = require('superagent');

const dotenv = require('dotenv').config();
app.use(cors());

class Forecast { 
  constructor(description, date) {
  this.description = description;
  this.date = date;
  }
}

const PORT = process.env.PORT || 3000;

function getWeather (request, response) {
  const lat = request.query.lat
  const lon = request.query.lon
  
  superagent.get(`${process.env.WEATHER_URL}?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}`)
    .then(res => {
      const currentWeather = res.body
      const weatherData = currentWeather.data.map((obj) => {
        return new Forecast(obj.weather.description, obj.valid_date);
      });
      response.send(weatherData);
    })
}

function getMovies (request, response) {
  const city = request.query.city

  superagent.get(`${process.env.MOVIES_URL}?api_key=${process.env.MOVIE_API_KEY}&query=${city}`)
  .then(res => {
    const movieData = res.body.results;
    console.log(movieData);
  })
}

app.get('/weather', getWeather);
app.get('/movies', getMovies)


app.listen(PORT, () => console.log(`listening on ${PORT}`));