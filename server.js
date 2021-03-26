'use strict'

const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();

const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies')

app.use(cors());
app.get('/weather', getWeather);
app.get('/movies', getMovies)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on ${PORT}`));