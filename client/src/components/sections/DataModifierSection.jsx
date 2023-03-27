import React, { useState } from "react";
import {
	CheckboxToggle,
	DateTimePicker,
	RadioButtonGroup,
	Picklist,
	Option,
} from "react-rainbow-components";
import "./css/DataModifierSection.css";

function DataModifierSection(props) {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [mode, setMode] = useState(null);
	const [selectedMachine, setSelectedMachine] = useState({});

	const onMachineSelect = (value) => {
		props.machines.map((machine) => {
			if (machine.machineName === value.name) {
				setSelectedMachine({ ...machine, optionValue: value });
			}
			console.log({
				value,
				machine,
				result: machine.machineName === value.name,
			});
		});
	};

	console.log({ machines: props.machines });

	return (
		<div className="container">
			<h1 id="handle-data" className="subtitle">Handle Data</h1>
			<div className="modifier-function-holder">
				<span className="date-modifier-sections">
					<DateTimePicker
						className="dateTimepicker-control-panel"
						formatStyle="large"
						label="Start Datetime"
						value={startDate}
					/>

					<DateTimePicker
						className="dateTimepicker-control-panel"
						formatStyle="large"
						label="End Datetime"
						value={endDate}
					/>
				</span>
				<span className="date-modifier-sections">
					<Picklist
						className="mode-picker-control-panel"
						label="Mode"
						placeholder="Select an Mode"
						value={mode}
						onChange={(value) => setMode(value)}
					>
						<Option name="header" label="Modes" variant="header" />
						<Option name="prod" label="Production" />
						<Option name="dev" label="Development" />
					</Picklist>

					<Picklist
						className="mode-picker-control-panel"
						label="Machine"
						placeholder="Select an Machine"
						value={selectedMachine.optionValue}
						onChange={(value) => onMachineSelect(value)}
						enableSearch
					>
						<Option name="header" label="Machines" variant="header" />
						{props.machines.map((data) => {
							return (
								<Option name={data.machineName} label={data.machineName} />
							);
						})}
					</Picklist>
				</span>
				<span className="date-modifier-sections">
					<Picklist
						className="mode-picker-control-panel"
						label="Sensor"
						placeholder="Select an Sensor"
						value={selectedMachine.machineName}
						onChange={(value) => setMode(value)}
						enableSearch
					>
						<Option name="header" label="Sensors" variant="header" />
						{selectedMachine.sensorType
							?.replaceAll(".", "")
							.split(",")
							.map((sensor) => {
								sensor = sensor.split(":")[0];
								return <Option name={sensor} label={sensor} />;
							})}
					</Picklist>
				</span>
				<span className="date-modifier-sections">
					<button className="my-button dev data-handler-button">Fetch</button>
					{mode?.name === "dev" ? (
						<button className="my-button dev data-handler-button">
							Migrate
						</button>
					) : (
						<></>
					)}
				</span>
			</div>
		</div>
	);
}

export default DataModifierSection;
