import axios from 'axios';
import { useEffect, useState } from 'react';
import { Cloud, FeelsLike, Search } from './svgs';
import './App.css';

type coordenates = {
  lon: string;
  lat: string;
}

const App = () => {
  const [weatherData, setWeatherData] = useState()
  const [cityCountry, setCityCountry] = useState()
  const [coords, setCoords] = useState<coordenates[]>()
  const [currentLocation, setCurrentLocation] = useState<boolean>(false)
  const [localName, setLocalName] = useState<string>('')
 
  const getCoords = () => {
    axios.get(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${localName}`)
    .then(res => {
      setCoords(res.data)
      setLocalName('')
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
      setCityCountry(res.data)
     })
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      getWeather(-23.539393708415584, -46.904488022971165 )
      setCurrentLocation(true)
    })
  }, [])

  useEffect(() => {
    coords?.map(item => {
      getWeather(parseFloat(item.lat), parseFloat(item.lon))
      setCoords(undefined)
    })
  }, [coords !== undefined])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
        document.removeEventListener('keydown', handleKeyPress)
    }
}, [localName]);

const handleKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      getCoords();
    }
}

  return (
    <div className='container'>
      <div className='search'>
        <input 
          value={localName} 
          autoFocus
          placeholder='Search' 
          onChange={(e) => setLocalName(e.target.value)} 
          type="text" 
        />
        <button 
          onClick={getCoords}>
            <Search />
        </button>
      </div>

      {cityCountry === undefined || weatherData === undefined ? (
            <div className='carregando'>
              {!currentLocation ? 'Allow location or search for any location above' : 'Loading...'}
            </div>
            ) : (
              <div className='weatherInfo'>
                <h2>{cityCountry['name']}, {cityCountry['sys']['country']}</h2>

                <div className='temp'>
                  <img src={`http://openweathermap.org/img/wn/${weatherData['current']['weather'][0]['icon']}@2x.png`}/>
                  <h1>{parseInt(weatherData['current']['temp'])}°</h1>
                </div>

                <div className='description'>
                  <Cloud />

                  <h3 className='descH3'>{weatherData['current']['weather'][0]['main']} | {weatherData['current']['weather'][0]['description']}</h3>
                  <FeelsLike />

                  <h3 className='feelsLikeH3'> Feels like {parseInt(weatherData['current']['feels_like'])}°</h3>
                </div>

                <div className='windHumidity'>
                  <div className='colorDIVwind'></div> 

                  <div className='winHumInfos'>
                    <p>WIND </p>
                    <p>{weatherData['current']['wind_speed']} mt/s</p>
                  </div>

                </div>
                <div className='windHumidity'>
                  <div className='colorDIVumidity'></div> 

                  <div className='winHumInfos'>
                    <p>HUMIDITY</p>
                    <p>{weatherData['current']['humidity']}%</p>
                  </div>

                </div>
              </div>
            )
          }
    </div>
  );
}

export default App;
