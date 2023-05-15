import { instance as axios } from "../axios";
export default (
	organization,
	modelName,
	modelAlgo,
	sensors,
	machineName,
	mode,
	trainDataSize,
	element
) => {
	axios
		.post(
			`/api/learn/start?organization=${organization}&modelName=${modelName}&modelAlgo=${modelAlgo}&sensors=${sensors}&machineName=${machineName}&mode=${mode}&trainDataSize=${trainDataSize}`
		)
		.then(() => {
			element.style.color = "green";
			element.innerText = "Training added";
		})
		.catch((error) => {
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
