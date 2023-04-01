import errorMessageDisplay from "../../utils/errorMessageDisplay.js";
import unCheckAll from "./unCheckAll.js";
export default (axios_instance, ids, machineId, organization, setData) => {
	axios_instance
		.patch("/api/migrate/data", { ids, machineId, organization })
		.then((response) => {
			console.log(response);
			unCheckAll(setData);
			const tickElement = document.getElementById("migrate-tick");
			tickElement.style.opacity = 1;
			setTimeout(() => {
				tickElement.style.opacity = 0;
			}, 1000);
		})
		.catch((error) => {
			errorMessageDisplay("modifier-error-holder", error);
		});
};
