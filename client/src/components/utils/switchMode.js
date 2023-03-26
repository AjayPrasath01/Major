import fetchMachineNames from "./fetchMachineNames";

export default (axios_instance, setDeviceList, mode, sensor, machineName, organization) => {
	sensor = sensor.split(":")[0];
	axios_instance
		.put("api/switch/mode", {
			machineName,
			sensor,
			mode,
			organization,
		})
		.then((res) => {
			fetchMachineNames(axios_instance, setDeviceList);
		})
		.catch(console.log);
};
