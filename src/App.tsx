import { useEffect, useState, useSyncExternalStore } from 'react';
import axios from 'axios';
import './App.css';
import { Cloud, FeelsLike } from './svgs'

type coordenates = {
  lon: string;
  lat: string
}

const App = () => {
  const [weatherData ,setWeatherData] = useState()
  const [coords, setCoords] = useState<coordenates[]>()
  const [currentLocation, setCurrentLocation] = useState(false)
  const [localName, setLocaName] = useState('')
  const [city, setCity] = useState()
 
  const getCoords = () => {
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${localName}`)
    .then(res => {
      setCoords(res.data)
    })
  }
 
  const getWeather = (lat: number, lon: number) => {
    axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=daily,hourly,minutely,lat,lon,timezone,timezone_offset&appid=1c2a982b34c4acb2a57bbd523ff8b146
    `)
    .then(res => {
      setWeatherData(res.data)
    })
    axios.get(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${lat}&lon=${lon}`)
     .then(res => {
       setCity(res.data)
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
    <div className='container'>
      <div>
        <input onChange={(e) => setLocaName(e.target.value)} type="text" />
        <button onClick={getCoords}>search</button>
      </div>

      {city === undefined || weatherData === undefined ? (
            <div>carregando...</div>
            ) : (
              <div className='weatherInfo'>
                <h2>{city['name']}, {city['sys']['country']}</h2>

                <div className='temp'>
                  <img  src={`http://openweathermap.org/img/wn/${weatherData['current']['weather'][0]['icon']}@2x.png`}/>
                  <h1>{parseInt(weatherData['current']['temp'])}°</h1>
                </div>

                <div className='description'>
                  <Cloud />
                  <h3 className='descH3'>{weatherData['current']['weather'][0]['main']} | {weatherData['current']['weather'][0]['description']}</h3>
                  <FeelsLike />
                  <h3 className='feelsLikeH3'> Feels like {parseInt(weatherData['current']['feels_like'])}°</h3>
                </div>

                <div className='wind'>
                  <div className='colorDIVwind'></div> 
                  <div className='windKMH'>
                    <p>WIND </p>
                    <p>{weatherData['current']['wind_speed']} mt/s</p>
                  </div>
                </div>
                <div className='wind'>
                  <div className='colorDIVumidity'></div> 
                  <div className='windKMH'>
                    <p>HUMIDITY</p>
                    <p>{weatherData['current']['humidity']}%</p>
                  </div>
                </div>

                <div>

                </div>
              </div>
            )
          }
    </div>
  );
}

export default App;
