import { useEffect, useState } from "react";
import './App.css'

interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  }
  weather: {
    description: string,
    icon: string;
  }[]
}
function App() {
  const [city, setCity] = useState<string>('Dubai');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  console.log(error)
  const API_KEY = import.meta.env.VITE_API_KEY;
  const fetchWeather = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
      if (!resp.ok) {
        throw new Error("city not found")
      }
      const data: WeatherData = await resp.json();
      setError("");
      console.log(data)
      setWeather(data)
    }
    catch (err) {
      setError((err as Error).message);
      setWeather(null)
    }
    finally {
      setLoading(false)
    }

  }
  useEffect(() => {
    fetchWeather();
  }, [])
  return (
    <div className="container">
      <h2>Weather App</h2>
      <div className="search-box">
      <input type="text" placeholder="Enter city" value={city} onChange={(e => { setCity(e.target.value) })} className="input" />
      <button onClick={fetchWeather} className="button">Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {weather && (
        <div className="card">
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="icon" />
          <p>🌡 Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>



  )
}

export default App;