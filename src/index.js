import WEATHER_KEY from './helpers/keys.js'
import unixConverter from './helpers/unix_converter.js'
const d = document,
  n = navigator,
  w = window,
  $main = d.querySelector('main'),
  $loader = d.getElementById('loader'),
  $appTitle = d.getElementById('app-title'),
  $weatherTemperature = d.querySelector('.current-temperature'),
  $weatherData = d.getElementById('weather-data'),
  $weatherAdvice = d.getElementById('weather-advice'),
  $sky = d.getElementById('sky'),
  $feelsLike = d.getElementById('feelsLike'),
  $humidity = d.getElementById('humidity'),
  $pressure = d.getElementById('pressure'),
  $seaLevel = d.getElementById('sea-level'),
  $temperature = d.getElementById('temperature'),
  $minTemperature = d.getElementById('min-temperature'),
  $maxTemperature = d.getElementById('max-temperature'),
  $sunrise = d.getElementById('sunrise'),
  $sunset = d.getElementById('sunset'),
  $windSpeed = d.getElementById('wind-speed'),
  $body = d.getElementsByTagName('body')[0],
  $weatherItems = d.querySelectorAll('.weather-data-content'),
  $getLocationMessage = d.querySelector('.get-location'),
  $footer = d.querySelector('footer'),
  $summaryWeather = d.querySelector('.summary-weather'),
  $lastUpdateBox = d.querySelector('.hidden-last-update'),
  $lastUpdate = d.getElementById('last-update')

const countryCodes = {
  AR: 'Argentina',
  BO: 'Bolivia',
  BR: 'Brasil',
  CL: 'Chile',
  CO: 'Colombia',
  CR: 'Costa Rica',
  CU: 'Cuba',
  DO: 'República Dominicana',
  EC: 'Ecuador',
  SV: 'El Salvador',
  GT: 'Guatemala',
  HN: 'Honduras',
  MX: 'México',
  NI: 'Nicaragua',
  PA: 'Panamá',
  PY: 'Paraguay',
  PE: 'Perú',
  PR: 'Puerto Rico',
  UY: 'Uruguay',
  VE: 'Venezuela',
}

function changeSky() {
  const date = new Date(),
    hours = date.getHours(),
    isMidnight = hours >= 0 && hours < 6,
    isMorning = hours >= 6 && hours < 12,
    isAfternoon = hours >= 12 && hours < 19,
    isNight = hours >= 19 && hours < 240

  const schedule = {
    midnight: {
      bg: 'rgb(16,16,16)',
      color: 'rgb(255,255,255)',
      itemBg: 'rgb(32,32,32)',
    },
    morning: {
      bg: 'rgb(89,89,255)',
      color: 'rgb(255,255,255)',
      itemBg: 'rgb(75,75,209)',
    },
    afternoon: {
      bg: 'rgb(255 223 151)',
      color: 'rgb(131 99 28)',
      itemBg: 'rgb(213 169 72)',
    },
    night: {
      bg: 'rgb(0 15 70)',
      color: 'rgb(132 159 255)',
      itemBg: 'rgb(8 27 92)',
    },
  }

  if (isMidnight) {
    const { bg, color, itemBg } = schedule.midnight
    $body.style.backgroundColor = bg
    $body.style.color = color
    $weatherItems.forEach((item) => {
      item.style.backgroundColor = itemBg
    })
  }
  if (isMorning) {
    const { bg, color, itemBg } = schedule.morning
    $body.style.backgroundColor = bg
    $body.style.color = color
    $weatherItems.forEach((item) => {
      item.style.backgroundColor = itemBg
    })
  }
  if (isAfternoon) {
    const { bg, color, itemBg } = schedule.afternoon
    $body.style.backgroundColor = bg
    $body.style.color = color
    $weatherItems.forEach((item) => {
      item.style.backgroundColor = itemBg
    })
  }
  if (isNight) {
    const { bg, color, itemBg } = schedule.night
    $body.style.backgroundColor = bg
    $body.style.color = color
    $weatherItems.forEach((item) => {
      item.style.backgroundColor = itemBg
    })
  }
}

async function getWeather(lat, lon) {
  try {
    let units = 'metric'
    const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_KEY}`
    const res = await fetch(API),
      json = await res.json()
    if (!res.ok) throw { status: res.status }
    return json
  } catch (error) {
    console.log(`error ${error.status}`)
  }
}
function handleLocationError(error) {
  $getLocationMessage.classList.add('hidden')
  $loader.classList.add('disabled')
  $weatherAdvice.textContent = 'Ha ocurrido un error'
  if (error.message.match('permission')) {
    $weatherAdvice.textContent +=
      ' , necesitas permitir el acceso a tu ubicación.'
  } else {
    $weatherAdvice.textContent += ', recarga la página y vuelve a intentarlo.'
  }
}

function formatTimeElapsed(unixTimestamp) {
  const totalSeconds = Math.abs(
    Math.floor((Date.now() - unixTimestamp * 1000) / 1000)
  )

  if (totalSeconds === 0) {
    return 'Recién'
  }

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = []
  if (days > 0) parts.push(`${days} día${days > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`)
  if (seconds > 0 || parts.length === 0)
    parts.push(`${seconds} segundo${seconds !== 1 ? 's' : ''}`)
  return `Hace ${parts.join(', ')}`
}

async function getUserPosition(pos) {
  let lat = await pos.coords.latitude,
    lon = await pos.coords.longitude,
    weather = await getWeather(lat, lon),
    country = 'N/A',
    lastUpdate = null

  weather.sys.sunrise = unixConverter(weather.sys.sunrise)
  weather.sys.sunset = unixConverter(weather.sys.sunset)
  weather.weather[0].main =
    weather.weather[0].main === 'Clouds' ? 'Nublado' : 'Despejado'
  $loader.classList.add('disabled')
  let city = weather.name,
    temp = Math.round(weather.main.temp)
  console.log(weather.name)
  country = countryCodes[weather.sys.country] || weather.sys.country
  $summaryWeather.classList.add('center-summary')
  $appTitle.textContent = `${city}, ${country}`
  lastUpdate = formatTimeElapsed(weather.dt)
  //   lastUpdate = lastUpdate.toLocaleString()
  $lastUpdate.textContent = lastUpdate
  $lastUpdateBox.classList.toggle('hidden-last-update')
  $weatherTemperature.textContent = `${temp}°`
  $appTitle.classList.add('current-city')
  $weatherAdvice.classList.add('disabled')
  $weatherData.classList.remove('disabled')
  $sky.innerHTML = weather.weather[0].main
  $feelsLike.innerHTML = `${weather.main.feels_like}°`
  $humidity.innerHTML = `${weather.main.humidity}%`
  $pressure.innerHTML = `${weather.main.pressure} inHg`
  $seaLevel.innerHTML = `${weather.main.sea_level} m.s.n.m`
  $temperature.innerHTML = `${weather.main.temp}°`
  $minTemperature.innerHTML = `${weather.main.temp_max}°`
  $maxTemperature.innerHTML = `${weather.main.temp_min}°`
  $sunrise.innerHTML = weather.sys.sunrise
  $sunset.innerHTML = weather.sys.sunset
  $windSpeed.innerHTML = `${weather.wind.speed} mph`
  $getLocationMessage.classList.add('hidden')
  $main.style.width = '90%'
  $weatherData.style.opacity = 0
  $footer.style.opacity = 0
  $footer.classList.remove('hidden')
  setTimeout(() => {
    $weatherData.style.opacity = 1
    $footer.style.opacity = 1
    $body.classList.add('baseline-layout')
  }, 300)
}

async function loadWeather() {
  setTimeout(() => {
    n.geolocation.getCurrentPosition(getUserPosition, handleLocationError)
  }, 2000)
}

d.addEventListener('DOMContentLoaded', async (e) => {
  changeSky()
  await loadWeather()
})
w.addEventListener('offline', (e) => {
  $appTitle.classList.remove('current-city')
  $appTitle.textContent = `Weather App`
  console.log($weatherAdvice.childNodes)
  $weatherAdvice.childNodes[1].classList.add('disabled')

  $weatherAdvice.textContent =
    'No estás conectado a internet, inténtalo más tarde'
  $weatherAdvice.classList.add('no-connection')
  $weatherAdvice.classList.remove('disabled')
  $weatherData.classList.add('disabled')
  $cloudContainer.classList.add('disabled')
})

w.addEventListener('online', (e) => {
  loadWeather()
})
