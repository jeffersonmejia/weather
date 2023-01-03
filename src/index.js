const d = document,
	n = navigator,
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

let lat = -1.0477487,
	lon = -80.5372243,
	key = "7ef54c9134170dce32fcaaecdcd58931";
console.log(lat, lon);
const getLocation = async () => {
	const options = {
		enableHighAccuracy: true,
		timeout: 1000,
		maximumAge: 0,
	};
	const success = async (pos) => {
		console.log(pos);
		lat = await pos.coords.latitude;
		lon = await pos.coords.longitude;
	};
	const error = (error) => {
		$error.classList.add("error-active");
		$error.innerHTML = "Lo sentimos... no se encontraron datos de la localización.";
	};
	n.geolocation.getCurrentPosition(success, error, options);
};

const getWeather = async () => {
	const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=7ef54c9134170dce32fcaaecdcd58931`;
	try {
		const res = await fetch(API);
		json = await res.json();
		if (!res.ok) throw { status: res.status };
		return json;
	} catch (error) {
		console.log(`error ${error.status}`);
	}
};

const loadWeather = async (e) => {
	getLocation();
	let weather = await getWeather();
	console.log(lat, lon);
	$lat.innerHTML = lat;
	$lon.innerHTML = lon;
	$sky.innerHTML = weather.weather[0].main;
	$feelsLike.innerHTML = weather.main.feels_like;
	$humidity.innerHTML = weather.main.humidity;
	$pressure.innerHTML = weather.main.pressure;
	$seaLevel.innerHTML = weather.main.sea_level;
	$temperature.innerHTML = weather.main.temp;
	$minTemperature.innerHTML = weather.main.temp_max;
	$maxTemperature.innerHTML = weather.main.temp_min;
	$sunrise.innerHTML = weather.sys.sunrise;
	$sunset.innerHTML = weather.sys.sunset;
	$windSpeed.innerHTML = weather.wind.speed;
};

d.addEventListener("DOMContentLoaded", loadWeather);
