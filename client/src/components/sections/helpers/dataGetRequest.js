import errorMessageDisplay from "../../utils/errorMessageDisplay.js";
export default (
	axios_instance,
	selectedMachine,
	mode,
	organization,
	startDate,
	endDate,
	limit,
	offset,
	setCurrentPage,
	setNoPages,
	setData,
	noPages
) => {
	axios_instance
		.get("/api/fetch/data", {
			params: {
				machineName: selectedMachine.machineNameOptionValue?.name,
				mode,
				sensor: selectedMachine.sensorNameOptionValue?.name,
				organization,
				startDate,
				endDate,
				limit,
				offset,
			},
		})
		.then((response) => {
			if (response.status === 200) {
				if (response.data.data.length > 0) {
					if (noPages !== response.data.pages) {
						setCurrentPage(1);
						setNoPages(response.data.pages);
					}
					setData(response.data.data === undefined ? [] : response.data.data);
					const tickElement = document.getElementById("fetch-tick");
					tickElement.style.opacity = 1;
					setTimeout(() => {
						tickElement.style.opacity = 0;
					}, 1000);
				} else {
					errorMessageDisplay("modifier-error-holder", {
						message: "No data from the sensor in selected period",
					});
				}
			} else {
				errorMessageDisplay("modifier-error-holder", {
					message: "No data in selected period",
				});
			}
		})
		.catch((error) => {
			errorMessageDisplay("modifier-error-holder", error);
		});
};
