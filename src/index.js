const d = document,
	$root = d.getElementById("root"),
	$template = d.querySelector("#main-template").content;

const mountComponent = (e) => {
	const $cityList = d.querySelector("#main-template");
	console.log($cityList);
	$root.appendChild($template);
};

d.addEventListener("DOMContentLoaded", mountComponent);
