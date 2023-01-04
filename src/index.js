import WEATHER_KEY from "./helpers/keys.js";
import unixConverter from "./helpers/unix_converter.js";

const d = document,
	n = navigator,
	$loader = d.getElementById("loader"),
	$appTitle = d.getElementById("app-title"),
	$weatherData = d.getElementById("weather-data"),
	$weatherAdvice = d.getElementById("weather-advice"),
	$error = d.getElementById("error-details"),
	$lat = d.getElementById("lat"),
	$lon = d.getElementById("lon"),
	$sky = d.getElementById("sky"),
	$feelsLike = d.getElementById("feelsLike"),
	$humidity = d.getElementById("humidity"),
	$pressure = d.getElementById("pressure"),
	$seaLevel = d.getElementById("sea-level"),
	$temperature = d.getElementById("temperature"),
	$minTemperature = d.getElementById("min-temperature"),
	$maxTemperature = d.getElementById("max-temperature"),
	$sunrise = d.getElementById("sunrise"),
	$sunset = d.getElementById("sunset"),
	$windSpeed = d.getElementById("wind-speed");

const getWeather = async (lat, lon) => {
	try {
		const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}`;
		const res = await fetch(API),
			json = await res.json();
		if (!res.ok) throw { status: res.status };
		return json;
	} catch (error) {
		console.log(`error ${error.status}`);
	}
};

const loadWeather = async (e) => {
	const getUserPosition = async (pos) => {
		let lat, lon;
		lat = pos.coords.latitude;
		lon = pos.coords.longitude;
		let weather = await getWeather(lat, lon);
		weather.sys.sunrise = unixConverter(weather.sys.sunrise);
		weather.sys.sunset = unixConverter(weather.sys.sunset);
		weather.weather[0].main =
			weather.weather[0].main === "Clouds" ? "Nublado" : "Despejado";

		$loader.classList.add("disabled");
		$appTitle.textContent = `${weather.name} ☁️`;
		$appTitle.classList.add("current-city");
		$weatherAdvice.classList.add("disabled");
		$weatherData.classList.remove("disabled");
		$lat.innerHTML = lat;
		$lon.innerHTML = lon;
		$sky.innerHTML = weather.weather[0].main;
		$feelsLike.innerHTML = `${weather.main.feels_like}°`;
		$humidity.innerHTML = `${weather.main.humidity}%`;
		$pressure.innerHTML = `${weather.main.pressure} inHg`;
		$seaLevel.innerHTML = `${weather.main.sea_level} m.s.n.m`;
		$temperature.innerHTML = `${weather.main.temp}°`;
		$minTemperature.innerHTML = `${weather.main.temp_max}°`;
		$maxTemperature.innerHTML = `${weather.main.temp_min}°`;
		$sunrise.innerHTML = weather.sys.sunrise;
		$sunset.innerHTML = weather.sys.sunset;
		$windSpeed.innerHTML = `${weather.wind.speed} mph`;
	};
	const handleErrors = (error) => {
		$loader.classList.add("disabled");
		$weatherAdvice.textContent = `Ha ocurrido un error, ${
			error.message.match("permission")
				? "habilita la ubicación y vuelve a intentarlo"
				: "vuelve más tarde."
		}.`;
	};
	navigator.geolocation.getCurrentPosition(getUserPosition, handleErrors);
};

d.addEventListener("DOMContentLoaded", loadWeather);
