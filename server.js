'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const getWeather = require('./modules/weather');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors);
app.get('/weather', weatherHandler);

function weatherHandler(request, response) {
  console.log('f')
  const { lat, lon } = request.query;
  const freshWeather = getWeather(lat, lon)
  freshWeather.then(summaries => response.send(summaries))
  .catch((error) => {
    console.error(error);
    response.status(200).send('Sorry. Something went wrong!')
  });
}   

app.listen(PORT, () => console.log(`Server up on ${PORT}`));
