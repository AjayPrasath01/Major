import React, { useEffect, useState, useRef } from "react";
import {
	CheckboxToggle,
	DateTimePicker,
	Pagination,
	Picklist,
	Option,
} from "react-rainbow-components";
import "./css/DataModifierSection.css";
import dataChangeRequest from "./helpers/dataChangeRequest";
import dataGetRequest from "./helpers/dataGetRequest";
import HandleDataActionButtons from "./subComponents/HandleDataActionButtons.jsx";
import dataDeleteRequest from "./helpers/dataDeleteRequest";
import dataMigrateRequest from "./helpers/dataMigrateRequest";
import errorMessageDisplay from "../utils/errorMessageDisplay";

const LIMIT = { max: 500, min: 10 };

function DataModifierSection(props) {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [mode, setMode] = useState(null);
	const [selectedMachine, setSelectedMachine] = useState({});
	const [limit, setLimit] = useState(10);
	let offset = useRef(0).current;
	const [noPages, setNoPages] = useState(0);
	const [data, setData] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const selectedData = useRef([]);
	const [selectedCount, setSelectedCount] = useState(0);

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

	useEffect(() => {
		selectedData.current = data.filter((value) => {
			return value.isChecked;
		});
		setSelectedCount(selectedData.current.length);
	}, [data]);

	useEffect(() => {
		setData([]);
	}, [startDate, endDate, mode, selectedMachine]);

	document.addEventListener("click", onClick);

	const fetchClicked = () => {
		dataGetRequest(
			props.axios_instance,
			selectedMachine,
			mode?.name,
			props.organization,
			startDate,
			endDate,
			limit,
			offset,
			setCurrentPage,
			setNoPages,
			setData,
			noPages
		);
	};

	useEffect(() => {
		if (currentPage - 1 !== offset) {
			offset = currentPage;
			fetchClicked();
		}
	}, [currentPage]);

	const updatClicked = () => {
		const ids = [];
		const values = [];
		if (selectedData.current.length === 0) {
			errorMessageDisplay("modifier-error-holder", {
				message: "Select some data to make the request",
			});
		} else {
			const machineId = selectedData.current[0].machineId;
			selectedData.current.map((value) => {
				ids.push(value.id);
				values.push(value.value);
			});

			dataChangeRequest(
				props.axios_instance,
				ids,
				values,
				props.organization,
				mode?.name.toUpperCase(),
				machineId,
				setData
			);
		}
	};

	const deleteClicked = () => {
		const ids = [];
		const values = [];
		if (selectedData.current.length === 0) {
			errorMessageDisplay("modifier-error-holder", {
				message: "Select some data to make the request",
			});
		} else {
			const machineId = selectedData.current[0].machineId;
			selectedData.current.map((value) => {
				ids.push(value.id);
				values.push(value.value);
			});
			dataDeleteRequest(
				props.axios_instance,
				ids,
				values,
				props.organization,
				mode?.name.toUpperCase(),
				machineId,
				setData
			);
		}
	};

	const paginationChange = (event) => {
		if (event.target.ariaLabel === "Goto Previous Page") {
			setCurrentPage(currentPage - 1);
		} else if ("Goto Next Page" === event.target.ariaLabel) {
			setCurrentPage(currentPage + 1);
		} else {
			setCurrentPage(parseInt(event.target.innerText));
		}
	};

	const onMigrateClicked = () => {
		const ids = [];
		if (selectedData.current.length === 0) {
			console.log("Prompt error");
			errorMessageDisplay("modifier-error-holder", {
				message: "Select some data to make the request",
			});
		} else {
			const machineId = selectedData.current[0].machineId;
			if (selectedData.current.length > 0) {
				selectedData.current.map((value) => {
					ids.push(value.id);
				});
				dataMigrateRequest(
					props.axios_instance,
					ids,
					machineId,
					props.organization,
					setData
				);
			}
		}
	};

	return (
		<div className="container" style={{ marginBottom: "2em" }}>
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
							event.target.value <= LIMIT.max
								? event.target.value <= LIMIT.min
									? LIMIT.min
									: event.target.value
								: LIMIT.max
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
						<HandleDataActionButtons
							onClick={fetchClicked}
							name={"Fetch"}
							tickId={"fetch-tick"}
						/>
						{mode?.name === "dev" ? (
							<HandleDataActionButtons
								className={"dia"}
								onClick={onMigrateClicked}
								name={"Migrate"}
								tickId={"migrate-tick"}
								selectedCount={selectedCount}
							/>
						) : (
							<></>
						)}
					</span>
					<span>
						<HandleDataActionButtons
							tickId="update-tick"
							className="dia"
							onClick={updatClicked}
							name={"Update"}
							selectedCount={selectedCount}
						/>

						<HandleDataActionButtons
							tickId={"delete-tick"}
							onClick={deleteClicked}
							name={"Delete"}
							selectedCount={selectedCount}
						/>
					</span>
				</span>
			</div>
			{data.length > 0 ? (
				<>
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
							pages={noPages}
							activePage={currentPage}
							onChange={paginationChange}
						/>
					</div>
				</>
			) : (
				<></>
			)}
			<span id="modifier-error-holder"></span>
		</div>
	);
}

export default DataModifierSection;
