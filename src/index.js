const d = document,
	$listCities = d.getElementById("form-cities");

let lat = -1.0477487,
	lon = -80.5372243,
	key = "7ef54c9134170dce32fcaaecdcd58931";

const API = `https://api.openweathermap.org/data/2.5/weather?lat=1.0477487&lon=-80.455405&appid=7ef54c9134170dce32fcaaecdcd58931`;

const getCities = async () => {
	const $select = d.createElement("select");
	try {
		const res = await fetch("http://127.0.0.1:5500/src/assets/db.json");
		const json = await res.json();
		if (!res.ok) throw { status: res.status };

		json.cities.forEach((city) => {
			let $option = d.createElement("option");
			$option.textContent = `${city}`;
			$select.appendChild($option);
		});
	} catch (error) {
		console.log(error.status);
	}
	return $select;
};

const getWeather = async () => {
	try {
		const res = await fetch(API);
		json = await res.json();
		if (!res.ok) throw { status: res.status };
		return json;
	} catch (error) {
		console.log(`error ${error.status}`);
	}
};

const mountComponent = async (e) => {
	let weather = await getWeather();
	console.log(weather);
	console.log(weather.coord);
	// -> lat, lon
	console.log(weather.main);
	//feels like,  humidity, pressure, sea_level, temp(max-min)
	console.log(weather.weather);
	//main, description(ex: broken clouds)
	console.log(weather.sys);
	//sunrise, sunset
	console.log(weather.wind);
	//speed
	let $cities = await getCities();

	$listCities.appendChild($cities);
};

d.addEventListener("DOMContentLoaded", mountComponent);
