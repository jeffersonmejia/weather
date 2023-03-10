import WEATHER_KEY from "./helpers/keys.js";
import unixConverter from "./helpers/unix_converter.js";
const d = document,
	n = navigator,
	w = window,
	$loader = d.getElementById("loader"),
	$appTitle = d.getElementById("app-title"),
	$weatherData = d.getElementById("weather-data"),
	$weatherAdvice = d.getElementById("weather-advice"),
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
	$windSpeed = d.getElementById("wind-speed"),
	$body = d.getElementsByTagName("body")[0],
	$weatherBoxes = d.querySelectorAll(".weather-data-content"),
	$skyBG = d.querySelectorAll(".clouds-bg img"),
	$audioBG = d.getElementById("audio-bg"),
	$footer = d.getElementById("footer"),
	$main = d.getElementById("main-layout"),
	$cloudContainer = d.createElement("div"),
	$feedBtn = d.getElementById("feedback-btn"),
	$modalFeedback = d.querySelector(".feedback-container"),
	$feedbackSubject = d.getElementById("feedback-subject-API");

let MAX_CLOUDS = 9,
	isOffline = false,
	isModalActive = false;

const loadClouds = () => {
	for (let i = 0; i < MAX_CLOUDS; i++) {
		let $clouds = d.createElement("img");
		$clouds.src = "./src/assets/cloud.png";
		$cloudContainer.appendChild($clouds);
	}
	$cloudContainer.classList.add("clouds-bg");
	$main.appendChild($cloudContainer);
};

const changeSky = () => {
	const date = new Date(),
		hours = date.getHours();

	if (hours > 6 && hours < 12) {
		$body.classList.add("morning-bg");
		$audioBG.src = "./src/assets/morning-audio.mp3";
		$audioBG.play();
		$audioBG.loop = true;
		$weatherBoxes.forEach((el) => el.classList.add("morning-box-bg"));
	}
	if (hours >= 12 && hours < 18) {
		$body.classList.add("midday-bg");
		$weatherBoxes.forEach((el) => el.classList.add("midday-box-bg"));
	}
	if (hours >= 18 && hours < 19) {
		$body.classList.add("afternoon-bg");
		$weatherBoxes.forEach((el) => el.classList.add("afternoon-box-bg"));
	}
	if (hours >= 19) {
		$body.classList.add("night-bg");
		$audioBG.src = "./src/assets/night-audio.mp3";
		$audioBG.autoplay = true;
		$audioBG.loop = true;
		$weatherBoxes.forEach((el) => el.classList.add("night-box-bg"));
		$modalFeedback.classList.add("dark-bg");
		$feedBtn.classList.add("dark-btn");
		$modalFeedback.childNodes[1].childNodes[15].classList.add("dark-btn");
	}
};

const getWeather = async (lat, lon) => {
	try {
		let units = "metric";
		const API = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_KEY}`;
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
		lat = pos.coords.latitude || "-0.1865944";
		lon = pos.coords.longitude || "-78.4305382";
		let weather = await getWeather(lat, lon);
		loadClouds();
		$body.classList.add("baseline-layout");

		weather.sys.sunrise = unixConverter(weather.sys.sunrise);
		weather.sys.sunset = unixConverter(weather.sys.sunset);
		weather.weather[0].main =
			weather.weather[0].main === "Clouds" ? "Nublado" : "Despejado";

		$loader.classList.add("disabled");
		$appTitle.textContent = `${weather.name} ${Math.round(weather.main.temp)}??`;
		$appTitle.classList.add("current-city");
		$weatherAdvice.classList.add("disabled");
		$weatherData.classList.remove("disabled");
		$sky.innerHTML = weather.weather[0].main;
		$feelsLike.innerHTML = `${weather.main.feels_like}??`;
		$humidity.innerHTML = `${weather.main.humidity}%`;
		$pressure.innerHTML = `${weather.main.pressure} inHg`;
		$seaLevel.innerHTML = `${weather.main.sea_level} m.s.n.m`;
		$temperature.innerHTML = `${weather.main.temp}??`;
		$minTemperature.innerHTML = `${weather.main.temp_max}??`;
		$maxTemperature.innerHTML = `${weather.main.temp_min}??`;
		$sunrise.innerHTML = weather.sys.sunrise;
		$sunset.innerHTML = weather.sys.sunset;
		$windSpeed.innerHTML = `${weather.wind.speed} mph`;
		$footer.classList.add("footer-active");
		$skyBG.forEach((el) => (el.src = "./src/assets/cloud.png"));
	};
	const handleErrors = (error) => {
		$loader.classList.add("disabled");
		$weatherAdvice.textContent = `Ha ocurrido un error, ${
			error.message.match("permission")
				? "habilita la ubicaci??n y vuelve a intentarlo"
				: "vuelve m??s tarde."
		}.`;
	};
	navigator.geolocation.getCurrentPosition(getUserPosition, handleErrors);
};
d.addEventListener("DOMContentLoaded", loadWeather);
d.addEventListener(
	"touchstart,",
	(e) => {
		$audioBG.play();
		$audioBG.pause();
		$audioBG.currentTime = 0;
		$audioBG.play();
		$audioBG.load();
		$audioBG.play();
	},
	false
);
d.addEventListener("DOMContentLoaded", (e) => {
	changeSky();
});
w.addEventListener("offline", (e) => {
	$appTitle.classList.remove("current-city");
	$appTitle.textContent = `Weather App`;
	console.log($weatherAdvice.childNodes);
	$weatherAdvice.childNodes[1].classList.add("disabled");

	$weatherAdvice.textContent = "No est??s conectado a internet, int??ntalo m??s tarde";
	$weatherAdvice.classList.add("no-connection");
	$weatherAdvice.classList.remove("disabled");
	$weatherData.classList.add("disabled");
	$cloudContainer.classList.add("disabled");

	$footer.classList.remove("footer-active");
});

w.addEventListener("online", (e) => {
	loadWeather();
});
d.addEventListener("click", (e) => {
	if (e.target.matches("#feedback-btn") || e.target.matches("#feedback-btn *")) {
		if (!isModalActive) {
			$modalFeedback.classList.add("feedback-container-active");
			$feedBtn.classList.add("btn-back");
			setTimeout(() => {
				$feedBtn.textContent = "arrow_back";
			}, 700);
			isModalActive = true;
		} else {
			$feedBtn.classList.remove("btn-back");
			$modalFeedback.classList.remove("feedback-container-active");
			setTimeout(() => {
				$feedBtn.textContent = "chat";
			}, 700);
			isModalActive = false;
		}
	}
	if (e.target.matches(".feedback-subject")) {
		console.log("hi");
		console.log($feedbackSubject, e.target.value);
		$feedbackSubject.value = e.target.value;
	}
});
console.log(w.history);
