export default function (unix_timestamp = 1549312452) {
	let date = new Date(unix_timestamp * 1000),
		hours = date.getHours(),
		minutes = "0" + date.getMinutes();

	return `${hours}:${minutes.substr(-2)}`;
}
