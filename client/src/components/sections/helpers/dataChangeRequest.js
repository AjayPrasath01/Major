import unCheckAll from "./unCheckAll";

export default (
	axios_instance,
	ids,
	values,
	organization,
	mode,
	machineId,
	setData
) => {
	axios_instance
		.put("/api/change/data", {
			ids,
			values,
			organization,
			mode,
			machineId,
		})
		.then((response) => {
			unCheckAll(setData);
			const tickElement = document.getElementById("update-tick");
			tickElement.style.opacity = 1;
			setTimeout(() => {
				tickElement.style.opacity = 0;
			}, 1000);
		})
		.catch((error) => {
			errorMessageDisplay("modifier-error-holder", error);
		});
};
