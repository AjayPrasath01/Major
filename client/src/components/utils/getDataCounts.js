export default (props, selectedMachine, setDataCount, organization) => {
	if (
		selectedMachine.machineName &&
		organization &&
		selectedMachine.selectedSensor
	) {
		const sensorMode = selectedMachine.selectedSensor.split(":");
		const sensor = sensorMode[0];
		const mode = sensorMode[1];
		props.axios_instance
			.get("/api/count/data/points", {
				params: {
					machinename: selectedMachine.machineName,
					organization,
					sensor,
					mode,
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
