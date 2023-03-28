import React, { useEffect, useState } from "react";
import {
	CheckboxToggle,
	DateTimePicker,
	RadioButtonGroup,
	Picklist,
	Option,
} from "react-rainbow-components";
import "./css/DataModifierSection.css";

const LIMIT = { max: 500, min: 10 };

function DataModifierSection(props) {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [mode, setMode] = useState(null);
	const [selectedMachine, setSelectedMachine] = useState({});
	const [limit, setLimit] = useState(10);
	const [offset, setOffset] = useState(0);

	const onMachineSelect = (value) => {
		props.machines.map((machine) => {
			if (machine.machineName === value.name) {
				setSelectedMachine({ ...machine, machineNameOptionValue: value });
			}
			console.log({
				value,
				machine,
				result: machine.machineName === value.name,
			});
		});
	};

	const onSensorSelected = (value) => {
		setSelectedMachine((previous) => {
			return { ...previous, sensorNameOptionValue: value };
		});
	};

	useEffect(() => {
		setSelectedMachine((previous) => {
			return { ...previous, sensorNameOptionValue: {} };
		});
	}, [selectedMachine?.machineNameOptionValue?.name]);

	const fetchClicked = () => {
		console.log({
			params: {
				machineName: selectedMachine.machineNameOptionValue.name,
				mode: mode.name,
				sensor: selectedMachine.sensorNameOptionValue.name,
				organization: props.organization,
				startDate,
				endDate,
				limit,
				offset,
			},
		});
		props.axios_instance
			.get("/api/fetch/data", {
				params: {
					machineName: selectedMachine.machineNameOptionValue.name,
					mode: mode.name,
					sensor: selectedMachine.sensorNameOptionValue.name,
					organization: props.organization,
					startDate,
					endDate,
					limit,
					offset,
				},
			})
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {});
	};

	return (
		<div className="container" style={{ position: "relative" }}>
			<span className="subtitle with-side-element">
				<span id="handle-data" className="inner">
					Handle Data
				</span>
			</span>
			<div className="limit-holder">
				<span className="limit-text">Limit</span>
				<input
					class="limit-input"
					type={"number"}
					min={LIMIT.min}
					max={LIMIT.max}
					value={limit}
					onChange={(event) =>
						setLimit(
							event.target.value <= LIMIT.max ? event.target.value : LIMIT.max
						)
					}
				></input>
			</div>
			<div className="modifier-function-holder">
				<span className="date-modifier-sections">
					<DateTimePicker
						className="dateTimepicker-control-panel"
						formatStyle="large"
						label="Start Datetime"
						value={startDate}
						onChange={setStartDate}
					/>

					<DateTimePicker
						className="dateTimepicker-control-panel"
						formatStyle="large"
						label="End Datetime"
						value={endDate}
						onChange={setEndDate}
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
						value={selectedMachine.machineNameOptionValue}
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
						value={selectedMachine.sensorNameOptionValue}
						onChange={(value) => onSensorSelected(value)}
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
				<span className="date-modifier-sections action-btn">
					<button
						className="my-button dev data-handler-button"
						onClick={fetchClicked}
					>
						Fetch
					</button>
					{mode?.name === "dev" ? (
						<button className="my-button dev data-handler-button">
							Migrate
						</button>
					) : (
						<></>
					)}
				</span>
				<div></div>
			</div>
		</div>
	);
}

export default DataModifierSection;
