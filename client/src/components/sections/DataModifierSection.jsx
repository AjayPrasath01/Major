import React, { useEffect, useState } from "react";
import {
	CheckboxToggle,
	DateTimePicker,
	Pagination,
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
	const [noPages, setNoPages] = useState(500);
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);

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

	function onClick(event) {
		const error_element = document.getElementById("modifier-error-holder");
		error_element.innerText = "";
	}

	document.addEventListener("click", onClick);

	const fetchClicked = () => {
		props.axios_instance
			.get("/api/fetch/data", {
				params: {
					machineName: selectedMachine.machineNameOptionValue?.name,
					mode: mode?.name,
					sensor: selectedMachine.sensorNameOptionValue?.name,
					organization: props.organization,
					startDate,
					endDate,
					limit,
					offset,
				},
			})
			.then((response) => {
				console.log(response);
				if (noPages !== response.data.pages) {
					setCurrentPage(1);
					setNoPages(response.data.pages);
				}
				setData(response.data.data);
			})
			.catch((error) => {
				console.log(error);
				const error_element = document.getElementById("modifier-error-holder");
				if (error.response.status === 400) {
					error_element.innerText = "Select all the values correctly";
				} else {
					let message = error.message;
					if (message) {
						error_element.innerText = message;
					}
				}
				error_element.style.display = "block";
				error_element.style.color = "red";
			});
	};

	const updatClicked = () => {};

	const deleteClicked = () => {};

	const paginationChange = (event) => {
		console.log(event);
		if (event.target.ariaLabel === "Goto Previous Page") {
			setCurrentPage(currentPage - 1);
		} else if ("Goto Next Page" === event.target.ariaLabel) {
			setCurrentPage(currentPage + 1);
		} else {
			setCurrentPage(parseInt(event.target.innerText));
		}
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
					<span>
						<button
							className="my-button dev data-handler-button"
							onClick={fetchClicked}
						>
							Fetch
						</button>
						{mode?.name === "dev" ? (
							<button className="my-button dev data-handler-button dia">
								Migrate
							</button>
						) : (
							<></>
						)}
					</span>
					<span>
						<button
							className="my-button dev data-handler-button dia"
							onClick={updatClicked}
						>
							Update
						</button>
						<button
							className="my-button dev data-handler-button"
							onClick={deleteClicked}
						>
							Delete
						</button>
					</span>
				</span>
			</div>
			<div className="table-handle-data-holder">
				<table className="table-handle-data">
					<thead className="table-header-handle-data">
						<tr>
							<td>Date Time</td>
							<td>Data Type</td>
							<td>Value</td>
							<td>Select</td>
						</tr>
					</thead>
					<tbody className="table-body-handle-data">
						{data.map((row, index) => {
							if (row.isChecked === undefined) {
								row.isChecked = false;
							}
							return (
								<tr>
									<td>{row.date}</td>

									<td>{row.data_type}</td>

									<td>
										<input
											className="value-editor"
											type={"number"}
											value={data[index].value}
											onChange={(event) => {
												const newData = [...data];
												newData[index].value = event.target.value;
												newData[index].isChecked = true;
												setData(newData);
											}}
										/>
									</td>
									<td>
										<input
											type={"checkbox"}
											checked={row.isChecked}
											onChange={(event) => {
												const newData = [...data];
												newData[index].isChecked = !row.isChecked;
												setData(newData);
											}}
										/>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<div>
				<Pagination
					pages={40}
					activePage={currentPage}
					onChange={paginationChange}
				/>
			</div>
			<span id="modifier-error-holder"></span>
		</div>
	);
}

export default DataModifierSection;
