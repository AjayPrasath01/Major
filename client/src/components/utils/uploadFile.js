import fetchMachineNames from "./fetchMachineNames";
export default (axios_instance, csv_file, params, element_id) => {
	console.log(params);
	console.log(csv_file);
	const element = document.getElementById(element_id);
	element.style.backgroundColor = "orange";
	element.innerText = "Analyzing the Data";
	element.style.display = "flex";
	axios_instance
		.post(
			`/api/learn/upload?machineName=${params.machineName}&organization=${params.organization}&sensor=${params.sensor}`,
			String(csv_file),
			{
				timeout: 1_000_000_000,
				headers: {
					"Content-Type": "text/plain",
				},
			}
		)
		.then(() => {
			element.style.backgroundColor = "green";
			element.innerText = "Data Ready for training\n✅";
			setTimeout(() => {
				element.style.display = "none";
			}, 3000);
		})
		.catch((error) => {
			console.log(error);
			element.style.backgroundColor = "red";
			element.innerText = "Something went wrong\n⛔️";
			setTimeout(() => {
				element.style.display = "none";
			}, 3000);
		});
};
