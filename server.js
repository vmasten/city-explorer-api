'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const weatherHandler = require('./modules/weather');
const getMovies = require('./modules/movies')
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.get('/weather', weatherHandler);
app.get('/movies', getMovies)


app.listen(PORT, () => console.log(`Server up on ${PORT}`));
