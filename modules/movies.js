'use strict';

const superagent = require('superagent');

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