'use strict';

const superagent = require('superagent');
let cache = require('./cache');

function getMovies (request, response) {
  const city = request.query.city
  const key = 'movies' + city;
  const imgUrlPrefix = `https://image.tmdb.org/t/p/w500`
  const url = process.env.MOVIES_URL;
  const params = {
    api_key: process.env.MOVIE_API_KEY,
    query: city
  }

  if (cache[key] !== undefined && (Date.now() - cache[key].timestamp < 12096e5)) {
    //holds data for 14 days since movie data is unlikely to change often
    console.log('movie cache hit');
  } else {
    console.log('movie cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url)
    .query(params)
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
  return cache[key].data;
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

module.exports = getMovies;