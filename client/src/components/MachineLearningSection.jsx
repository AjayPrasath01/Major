import React, { useEffect, useState } from "react";
import "./MachineLearningSection.css";
import { RadioButtonGroup } from "react-rainbow-components";
import { every } from "sockjs-client/lib/transport-list";

function MachineLearningSection(props) {
	const modelAlgos = [
		{ value: "teatop", label: "Best" },
		{ value: "randomforest", label: "RandomForest" },
		{ value: "decisiontree", label: "DecisionTree" },
		{ value: "svm", label: "SVM" },
		{ value: "knn", label: "KNN" },
	];

	const machines = props.machines.map((element) => {
		return { value: element.machineName, label: element.machineName };
	});

	const modes = [
		{ value: "dev", label: "Dev" },
		{ value: "prod", label: "Prod" },
	];

	const [sensorPlatteCount, setSensorPlatteCount] = useState(1);
	const [mode, setMode] = useState("dev");
	const [algo, setAlgo] = useState(modelAlgos[0].value);
	const [selectedMachine, setSelectedMachine] = useState(machines[0]?.value);
	const [sensors, setSensors] = useState([]);

	useEffect(() => {
		const machinesLst = props.machines;
		for (let device of machinesLst) {
			if (device.machineName == selectedMachine) {
				const unProcessedSensor = device.sensorType.split(",");
				setSensors((previous) => {
					const new_sensors = [];
					for (const sensor of unProcessedSensor) {
						new_sensors.push(sensor.split(":")[0]);
					}
					console.log({ new_sensors });
					return new_sensors;
				});
			}
		}
	}, [selectedMachine]);

	const onAlgoChange = (event) => {
		setAlgo(event.target.defaultValue);
	};

	const onModeChange = (event) => {
		setMode(event.target.defaultValue);
	};

	const onMachineChange = (event) => {
		setSelectedMachine(event.target.defaultValue);
	};
	return (
		<div className="container" style={{ paddingTop: "5em" }}>
			<span className="subtitle with-side-element">
				<span id="handle-data" className="inner">
					Machine Learning
				</span>
			</span>

			<span className="block ml-margin">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight">
					Machine Name
				</span>
				<RadioButtonGroup
					options={machines}
					value={selectedMachine}
					onChange={onMachineChange}
				/>
			</span>

			<span className="block ml-margin">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight">
					Algo
				</span>
				<RadioButtonGroup
					options={modelAlgos}
					value={algo}
					onChange={onAlgoChange}
				/>
			</span>

			<span className="block ml-margin">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight">
					Data To Use
				</span>
				<RadioButtonGroup
					options={modes}
					value={mode}
					onChange={onModeChange}
				/>
			</span>

			<span className="block ml-margin position-relative ml-border padding normal-border-radius">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight position-absolute ml-top ml-left ml-margin-left ml-same-background">
					Sensors
				</span>
				<div className="flex-row">
					{sensors.map((element) => {
						return (
							<span className="medium-box dash-border normal-border-radius ml-margin-left flex-column sensor-pallet-padding space-between">
								<div className="margin-center ml-label-font-weight">
									{element}
								</div>
								<button className="no-border plus-big">+</button>
							</span>
						);
					})}
				</div>
			</span>
		</div>
	);
}

export default MachineLearningSection;
