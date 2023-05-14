import React, { useEffect, useState, useRef } from "react";
import "./MachineLearningSection.css";
import { RadioButtonGroup } from "react-rainbow-components";
import FileUploadElement from "./FileUploadElement.jsx";
import startTraining from "./utils/startTraining";

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

	const [mode, setMode] = useState("dev");
	const [algo, setAlgo] = useState(modelAlgos[0].value);
	const [selectedMachine, setSelectedMachine] = useState(machines[0]?.value);
	const [sensors, setSensors] = useState([]);
	const [modelName, setModelName] = useState("");
	const [trainDataSize, setTrainDataSize] = useState(10);

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

	const startLearning = () => {
		const element = document.getElementById("error-text-ml");
		element.style.display = "inline";
		element.style.paddingLeft = "1em";
		element.innerText = "";
		element.style.color = "red";
		if (!trainDataSize > 95 || !trainDataSize < 1) {
			console.log(selectedMachine);
			if (selectedMachine) {
				if (modelName) {
					console.log({
						organization: props.organization,
						modelName,
						modelAlgo: algo,
						sensors: sensors.join(","),
						machineName: selectedMachine,
						mode,
						trainDataSize,
					});
					startTraining(
						props.organization,
						modelName,
						algo,
						sensors.join(","),
						selectedMachine,
						mode,
						trainDataSize / 100,
						element
					);
				} else {
					element.innerText = "Model Name must not be blank";
				}
			} else {
				element.innerText = "Machine is not selected";
			}
		} else {
			element.innerText = "Train data size should be between 1 and 95";
		}
		setTimeout(() => {
			element.style.display = "none";
		}, 1000);
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

			<span className="block ml-margin">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight">
					Model Name
				</span>
				<input
					type="text"
					className="common-padding no-border normal-border-radius"
					placeholder="Model Name"
					value={modelName}
					onChange={(event) => setModelName(event.target.value)}
				/>
			</span>

			<span className="block ml-margin">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight">
					Train Data Size
				</span>
				<input
					type="number"
					className="common-padding no-border normal-border-radius"
					placeholder="Percentage"
					value={trainDataSize}
					onChange={(event) => setTrainDataSize(event.target.value)}
					min={1}
					max={95}
				/>
			</span>

			<span className="block ml-margin position-relative ml-border padding normal-border-radius">
				<span className="ml-margin-right ml-label-font-size ml-label-font-weight position-absolute ml-top ml-left ml-margin-left ml-same-background">
					Sensors
				</span>
				<div className="flex-row">
					{sensors.length > 0 ? (
						<>
							{sensors.map((element, index) => {
								return (
									<FileUploadElement
										key={index}
										sensorName={element}
										axios_instance={props.axios_instance}
										organization={props.organization}
										machineName={selectedMachine}
										algo={algo}
									/>
								);
							})}
						</>
					) : (
						<h2 className="margin-left-auto margin-right-auto">
							No sensor Present in the selected machine
						</h2>
					)}
				</div>
			</span>
			<button
				className="no-border common-padding background-green color-white text-bold normal-border-radius"
				onClick={startLearning}
			>
				Start Training
			</button>
			<span id="error-text-ml"></span>
		</div>
	);
}

export default MachineLearningSection;
