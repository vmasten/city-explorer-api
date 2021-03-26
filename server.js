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

class Movie {
  constructor(title, overview, average_votes, total_votes, image_url, popularity, released_on) {
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.image_url = image_url;
    this.popularity = popularity;
    this.released_on = released_on;
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
      response.status(200).send(weatherData);
    })
    .catch(err => {
      console.log('superagent failed');
      response.status(500).send('kerplode! something broke on our end :(')
    })
}

function getMovies (request, response) {
  const city = request.query.city
  const imgUrlPrefix = `https://image.tmdb.org/t/p/w500`

  superagent.get(`${process.env.MOVIES_URL}?api_key=${process.env.MOVIE_API_KEY}&query=${city}`)
  .then(res => {
    const movieData = res.body.results;
    const movieMap = movieData.map((obj) => {
      return new Movie(obj.original_title, obj.overview, obj.vote_average, obj.vote_count, `${imgUrlPrefix}${obj.poster_path}`, obj.popularity, obj.release_date)
    })
    response.status(200).send(movieMap);
  })
  .catch(err => {
    console.log('superagent failed');
    response.status(500).send('kerplode! something broke on our end :(')
  })
}

app.get('/weather', getWeather);
app.get('/movies', getMovies)


app.listen(PORT, () => console.log(`listening on ${PORT}`));