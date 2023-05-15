import { instance as axios } from "../axios";
import getModels from "./getModels";
export default (
	organization,
	modelKey,
	selectedMachine,
	setMlModels,
	element
) => {
	axios
		.delete(
			`/api/learn/model?organization=${organization}&modelKey=${modelKey}`
		)
		.then(() => {
			element.style.color = "green";
			element.innerText = "Model Deleted";
			getModels(axios, organization, selectedMachine, setMlModels);
		})
		.catch((error) => {
			element.style.color = "red";
			element.style.display = "block";
			if (error.response?.data?.error) {
				element.innerText = error.response.data.error;
			} else if (error.response?.data?.message) {
				element.innerText = error.response.data.message;
			} else {
				element.innerText = "Something went wrong";
			}
			console.log(error);
		});
};
