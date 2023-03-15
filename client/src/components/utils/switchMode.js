import fetchMachineNames from "./fetchMachineNames";

export default (props, setDeviceList, mode, sensor, machineName, organization) => {
	sensor = sensor.split(":")[0];
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
