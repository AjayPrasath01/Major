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
		.delete("/api/remove/data", {
			data: { ids, values, organization, mode, machineId },
		})
		.then((response) => {
			setData((previous) => {
				const newData = previous.filter((value) => {
					return !value.isChecked;
				});
				return newData;
			});
			const tickElement = document.getElementById("delete-tick");
			tickElement.style.opacity = 1;
			setTimeout(() => {
				tickElement.style.opacity = 0;
			}, 1000);
		})
		.catch((error) => {
			errorMessageDisplay("modifier-error-holder", error);
		});
};
