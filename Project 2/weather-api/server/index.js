require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

if (!WEATHER_API_KEY) {
  console.error('Weather API Key is not set in environment variables. Please check your .env file.');
  process.exit(1);
}

app.use(cors());
app.use(express.json());

app.get('/api/weather/:city', async (req, res) => {
  const city = req.params.city;
  const weatherApiUrl = `http://api.weatherstack.com/current?access_key=${WEATHER_API_KEY}&query=${encodeURIComponent(city)}`;

  try {
    const response = await fetch(weatherApiUrl);
    const data = await response.json(); 

    if (data.error || !response.ok) {
      const errorMessage = data.error ? data.error.info : 'Error fetching weather data';
      const statusCode = data.error ? data.error.code : response.status;
      
      console.error(`Weatherstack API error for city ${city}:`, errorMessage);
      return res.status(statusCode || 500).json({ message: errorMessage });
    }

    res.json(data);
  } catch (error) {
    console.error('Error in /api/weather:', error);
    res.status(500).json({ message: 'Server error fetching weather data' });
  }
});

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from Express.js backend...!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
