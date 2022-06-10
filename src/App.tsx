import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

type coordenates = {
  lon: string;
  lat: string
}

const App = () => {
  const [weatherData ,setWeatherData] = useState()
  const [coords, setCoords] = useState<coordenates[]>()
  const [currentLocation, setCurrentLocation] = useState(false)
  const [localName, setLocaName] = useState('')
 
  const getCoords = () => {
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${localName}`)
    .then(res => {
      setCoords(res.data)
    })
  }
  
  const getWeather = (lat: number, lon: number) => {
    axios.get(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${lon}`)
    .then(res => {
      setWeatherData(res.data)
    })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      getWeather(position.coords.latitude, position.coords.longitude)
      setCurrentLocation(true)
    })
  }, [!currentLocation])

  useEffect(() => {
    coords?.map(item => {
      getWeather(parseFloat(item.lat), parseFloat(item.lon))
      setCoords(undefined)
    })
  }, [coords !== undefined])

  return (
    <div>
      <input onChange={(e) => setLocaName(e.target.value)} type="text" />
      <button onClick={getCoords}>search</button>

      {weatherData === undefined ? (
            <div>carregando...</div>
            ) : (
              <div>
                <h2>{weatherData['name']}, {weatherData['sys']['country']}</h2>
                <h1>{weatherData['main']['temp']}°</h1>
                <h1>{weatherData['weather'][0]['main']}</h1>
                <h2>{weatherData['weather'][0]['description']}</h2>
                <img  src={weatherData['weather'][0]['icon']} alt={weatherData['weather'][0]['description']} />

              </div>
            )
          }
    </div>
  );
}

export default App;
