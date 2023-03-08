export default (props, selectedMachine, setDataCount, organization) => {
	if (
		selectedMachine.machineName &&
		organization &&
		selectedMachine.selectedSensor
	) {
		props.axios_instance
			.get("/api/count/data/points", {
				params: {
					machinename: selectedMachine.machineName,
					organization,
					sensor: selectedMachine.selectedSensor,
				},
			})
			.then((response) => {
				setDataCount(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	} else {
		console.log("Count request blocked due to missing params");
	}
};
