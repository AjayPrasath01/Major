import React from "react";
import switchMode from "./utils/switchMode";

function SensorIndividualContainer(props) {
	const {
		sensor,
		removeSensorClicked,
		data,
		mode,
		setDeviceList,
		organization,
	} = props;
	console.log({ data });
	function onModeClick() {
		data.mode = data.mode === "dev" ? "prod" : "dev";
		switchMode(props, setDeviceList, data, sensor, organization);
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
				data={JSON.stringify(data)}
			>
				⛔️
			</button>
		</span>
	);
}

export default SensorIndividualContainer;
