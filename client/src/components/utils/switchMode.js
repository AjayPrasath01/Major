import fetchMachineNames from "./fetchMachineNames";

export default (props, setDeviceList, data, sensor, organization) => {
	const { machineName, mode } = data;
	console.log({ data });
	props.axios_instance
		.put("api/switch/mode", {
			machineName,
			sensor,
			mode,
			organization,
		})
		.then((res) => {
			fetchMachineNames(props, setDeviceList);
		})
		.catch(console.log);
};
