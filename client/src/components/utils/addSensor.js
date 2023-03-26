import fetchMachineNames from "./fetchMachineNames";
export default (axios_instance, newMachineData, setDeviceList) => {
	let element = document.getElementById("table_status3");
	console.log(newMachineData);
	axios_instance
		.put("/api/update/sensors", { ...newMachineData })
		.then((res) => {
			element.innerText = "Updated the data";
			element.style.display = "block";
			element.style.color = "green";

			fetchMachineNames(axios_instance, setDeviceList);
		})
		.catch((error) => {
			console.log(error);
			const message = error.response?.data?.message;
			if (error.response?.status === 409) {
				element.innerText = "Duplicate sensor not allowed";
				element.style.display = "block";
				element.style.color = "red";
			} else if (error.response?.status === 400) {
				element.innerText = "Bad request check sensor name";
				element.style.display = "block";
				element.style.color = "red";
			} else if (error.response?.status === 404) {
				element.innerText = "Server is down";
				element.style.display = "block";
				element.style.color = "red";
			} else {
				if (message) {
					element.innerText = message;
				} else {
					element.innerText = "Something went wrong";
				}
				element.style.display = "block";
				element.style.color = "red";
			}
			console.log(error.response.status);
			console.log("Duplicate");
		});
};
