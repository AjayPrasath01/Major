export default (element_id, error) => {
	const error_element = document.getElementById(element_id);
	if (error.response?.status === 400) {
		error_element.innerText = "Select all the values correctly";
	} else if (error.response?.status === 404) {
		error_element.innerText = "Server can't be found";
	} else {
		const message = error.message;
		if (message) {
			console.log(message);
			setTimeout(() => {
				error_element.innerText = message;
			}, 100);
		}
	}
	console.log(document.getElementById(element_id));
	error_element.style.display = "block";
	error_element.style.color = "red";
};
