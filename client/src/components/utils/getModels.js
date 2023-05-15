export default (axios_instance, organization, machineName, setModels) => {
	axios_instance
		.get(
			`/api/learn/ml/models?organization=${organization}&machineName=${machineName}`
		)
		.then((response) => {
			setModels(response.data);
		})
		.catch((error) => {
			console.log({ error });
		});
};
