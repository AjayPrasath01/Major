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
	const [mode, setMode] = useState("dev");

	console.log({ machines: props.machines });

	return (
		<div className="container">
			<h1 className="subtitle">Handle Data</h1>
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
						value={mode}
						onChange={(value) => setMode(value)}
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
						value={mode}
						onChange={(value) => setMode(value)}
						enableSearch
					>
						<Option name="header" label="Sensors" variant="header" />
						{/* {sensors.map((sensor) => {
							return <Option name={sensor} label={sensor} />;
						})} */}
					</Picklist>
				</span>
			</div>
		</div>
	);
}

export default DataModifierSection;
