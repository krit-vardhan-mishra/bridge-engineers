import { useEffect, useState } from "react";
import { Cloudy, Search, Snowflake } from 'lucide-react';

// Header component integrated since we can't import external files
const Header = ({ title }) => {
  return (
    <header className="w-full h-[70px] fixed top-0 left-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-md flex items-center justify-between">
      <h1 className="ms-6 text-white text-2xl font-bold flex items-center gap-2">
        <Snowflake className="m-[10px]" />
        {title}
      </h1>
      
      <div className="flex items-center gap-3 me-6">
        <div className="p-2 rounded-full hover:bg-white/20 transition duration-200 cursor-pointer group">
          <Cloudy className="me-[15px] text-white w-6 h-6 group-hover:scale-110 transition-transform" />                    
        </div>
      </div>
    </header>
  );
};

const HomePage = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Delhi');
  const [inputCity, setInputCity] = useState('Delhi');
  const [image, setImage] = useState('https://cdn.weatherapi.com/weather/64x64/day/116.png'); // Default sunny icon
  const [temperature, setTemperature] = useState('20°C');

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/weather/${cityName}`);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Check if API returned an error
      if (data.error) {
        throw new Error(data.error.info || 'API returned an error');
      }
      
      setWeatherData(data);
      setTemperature(`${data.current.temperature}°C`);
      setImage(data.current.weather_icons[0]);
      
    } catch (err) {
      console.error('Fetch error:', err);
      
      // Provide more specific error messages
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Cannot connect to weather service. Make sure the backend server is running on port 5000.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to reach the weather service. Check if the backend is running.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      fetchWeather(inputCity.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600" style={{ fontFamily: '"Montserrat", system-ui, -apple-system, sans-serif' }}>
      <Header title="Weather Stack" />
      
      <div className="pt-[70px] flex min-h-screen">
        {/* Left side - Text content */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="text-white max-w-md">
            <h1 className="text-4xl font-bold mb-4">Real-Time & Historical</h1>
            <h2 className="text-3xl font-bold mb-6 text-blue-100">World Weather Data API</h2>
            <p className="text-lg leading-relaxed text-blue-50">
              Retrieve instant, accurate weather information for<br />
              any location in the world in lightweight JSON format.
            </p>
          </div>
        </div>

        {/* Right side - Weather widget */}
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="w-[500px] h-[300px] rounded-lg border-2 border-white bg-white/10 backdrop-blur-md p-6">
            {/* Search Input */}
            <div className="flex items-center gap-2 mb-6">
              <input 
                className="flex-1 px-4 py-2 border-2 border-white/30 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:border-white"
                type="text" 
                placeholder="Enter the city name..."
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                onClick={handleSearch}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                disabled={loading}
              >
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Weather Display */}
            <div className="text-center text-white">
              {loading && (
                <div className="flex items-center justify-center h-32">
                  <div className="text-lg">Loading weather data...</div>
                </div>
              )}
              
              {error && (
                <div className="text-red-300 bg-red-500/20 p-4 rounded-lg">
                  Error: {error}
                </div>
              )}
              
              {weatherData && !loading && (
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-xl font-semibold">{weatherData.location.name}</h3>
                  <div className="flex items-center gap-4">
                    <img 
                      src={image} 
                      alt="Weather icon"
                      className="w-16 h-16"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/64x64/ffffff/000000?text=?';
                      }}
                    />
                    <div className="text-3xl font-bold">{temperature}</div>
                  </div>
                  <div className="text-lg text-blue-100">
                    {weatherData.current.weather_descriptions[0]}
                  </div>
                </div>
              )}
              
              {!weatherData && !loading && !error && (
                <div className="text-blue-100">
                  Enter a city name to get weather information
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;