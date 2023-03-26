import React from "react";
import switchMode from "./utils/switchMode";

function SensorIndividualContainer(props) {
	let { sensor, removeSensorClicked, data, mode, setDeviceList, organization, axios_instance } =
		props;
	const rawSensor = sensor;
	const sensorMode = sensor.split(":");
	sensor = sensorMode[0];
	mode = sensorMode[1];
	function onModeClick() {
		mode = mode === "dev" ? "prod" : "dev";
		switchMode(
			axios_instance,
			setDeviceList,
			mode,
			sensor,
			data.machineName,
			organization
		);
	}
	return (
		<span className="sensor-individual-holder">
			<button
				onClick={onModeClick}
				className={mode === "dev" ? "mode-shower dev" : "mode-shower prod"}
			>
				{mode.toUpperCase()}
			</button>
			<p className="sensor-name-holder">{sensor}</p>
			<button
				className="remove-sensor-button"
				onClick={removeSensorClicked}
				sensor={sensor}
				rawsensor={rawSensor}
				data={JSON.stringify(data)}
			>
				⛔️
			</button>
		</span>
	);
}

export default SensorIndividualContainer;
