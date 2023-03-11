import React, { useEffect, useState, useRef, useCallback } from "react";
import NavBar from "./NavBar";
import "./Dashboard.css";
import { CSVLink } from "react-csv";
import BarChart from "./BarChart";
import LineChart from "./LineChart";
import * as SockJS from "sockjs-client";
import PositionSensorDisplay from "./PositionSensorDisplay";
import { CheckboxToggle, DateTimePicker } from "react-rainbow-components";
import { useNavigate } from "react-router-dom";
import loginStausChecker from "./utils/loginStausChecker";
import noDataAnim from "../assets/noDataAnim.json";
import socketErrorHandler from "./utils/socketErrorHandler";
import socketConnectionOpenHandler from "./utils/socketConnectionOpenHandler";
import socketConnectionClosedHandler from "./utils/socketConnectionClosedHandler";
import getDataCounts from "./utils/getDataCounts";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import socketMessageHandler from "./utils/socketMessageHandler";
import socketSend from "./utils/socketSend";
import offsetBody from "./utils/offsetBody";
import NoData from "./NoData";

function Dashboard(props) {
	const [machineDetails, setMachineDetails] = useState([]);
	const [selectedMachine, setSelectedMachine] = useState({});
	const [data, setData] = useState([]);
	const [lineFill, setLineFill] = useState(false);
	const [dataCount, setDataCount] = useState(0);
	const [beginAtZero, setBeginAtZero] = useState(true);
	const [viewLog, setViewLog] = useState(false);
	const [logs, setLogs] = useState([]);
	const csvLink = useRef();
	const sock = useRef(null);
	const handleDataForSock = useRef({});
	const [username, setUsername] = useState("");
	const [organization, setOrganization] = useState("");
	const navigate = useNavigate();
	const sockets = useRef([]);
	const [socketDetails, setSocketDetails] = useState({
		isSocketConnected: false,
	});
	const [chartDetails, setChartDetails] = useState((previous) => {
		const startDate = new Date();
		startDate.setHours(startDate.getHours() - 24);
		return { startDate, endDate: new Date(), chartType: "bar", isLive: true };
	});

	// const requestDataInSocketOnChnageValue = useCallback(() => {

	// 	//SensorType is heat, freq
	// }, [selectedMachine.machineName, selectedMachine.sensorType])

	// const [dataCardDetails, setDataCardDetails] = useState({width: });

	// const [startDateTime, setStartDateTime] = useState(() => {
	// 	let date = new Date();
	// 	// date.setHours(date.getHours() - 3);
	// 	// date = date.toLocaleString("en-US", {
	// 	// 	hour12: false,
	// 	// 	year: "numeric",
	// 	// 	month: "2-digit",
	// 	// 	day: "2-digit",
	// 	// 	hour: "2-digit",
	// 	// 	minute: "2-digit",
	// 	// 	second: "2-digit",
	// 	// });
	// 	return date;
	// });

	// const [endDateTime, setEndDateTime] = useState(() => {
	// 	let date = new Date();
	// 	// date.setHours(date.getHours() - 3);
	// 	// date = date.toLocaleString("en-US", {
	// 	// 	hour12: false,
	// 	// 	year: "numeric",
	// 	// 	month: "2-digit",
	// 	// 	day: "2-digit",
	// 	// 	hour: "2-digit",
	// 	// 	minute: "2-digit",
	// 	// 	second: "2-digit",
	// 	// });
	// 	return date;
	// });

	const dataCountCall = () => {
		getDataCounts(props, selectedMachine, setDataCount, organization);
	};

	useEffect(() => {
		dataCountCall();
		const socketRequest = {
			isAlive: chartDetails.isLive,
			dataSubscribed: true,
			machineName: selectedMachine.machineName,
			sensor: selectedMachine.selectedSensor,
			startDate: chartDetails.startDate,
			endDate: chartDetails.endDate,
		};
		if (sock.current?.readyState === 1) {
			socketSend(sock, socketRequest);
		}
	}, [
		selectedMachine,
		sock.current?.readyState,
		chartDetails.startDate,
		chartDetails.endDate,
		chartDetails.isLive,
	]);

	useEffect(() => {
		offsetBody();
		loginStausChecker(props, navigate, { setOrganization, setUsername });

		sock.current = new SockJS(props.server + "/ws", {
			headers: { "X-XSRF-TOKEN": props.xsrf },
		});

		socketErrorHandler(sock);
		socketMessageHandler(sock, setLogs, setData, setDataCount);
		socketConnectionOpenHandler(sock, setSocketDetails);
		socketConnectionClosedHandler(sock, setSocketDetails);

		sockets.current.push(sock);

		props.axios_instance.get(`api/fetch/machineNames`).then((res) => {
			console.log("machinenames", res);
			if (res.data.length > 0) {
				setMachineDetails(res.data);
				setSelectedMachine((previousValue) => {
					return {
						...res.data[0],
						selectedSensor: res.data[0].sensorType.split(",")[0],
					};
				});
				dataCountCall();
			}
		});
	}, []);

	function commandKeyDown(event) {
		if (event.key === "Enter" && event.target.value !== "") {
			const command = event.target.value;
			let resultLog = [...logs, { log: "> " + event.target.value }];
			event.target.value = "";
			if (command === "delete") {
				props.axios_instance
					.delete("/api/log/data", {
						params: { machineName: selectedMachine.machineName, organization },
					})
					.then((res) => {
						console.log(res);
						resultLog = [
							{ log: "> " + command },
							{ log: "<span class='INFO'>" + res.data.message + "</span>" },
						];
						setLogs(resultLog);
					})
					.catch((err) => {
						if (err.message) {
							resultLog = [
								...resultLog,
								{ log: "<span class='ERROR'>" + err.message + "</span>" },
							];
						} else {
							resultLog = [
								...resultLog,
								{ log: "<span class='ERROR'>Something went wrong</span>" },
							];
						}
						setLogs(resultLog);
					});
			} else if (command === "clear") {
				setLogs([]);
			}
		}
	}

	function machineTabClicked(event) {
		machineDetails.map((machine) => {
			if (machine.machineName === event.target.getAttribute("data")) {
				setSelectedMachine((previousValue) => {
					if (viewLog) {
						setLogs([]);
						socketSend(sock, {
							logSubscribed: viewLog,
							machineName: machine.machineName,
						});
					}
					return {
						...machine,
						selectedSensor: machine.sensorType.split(",")[0],
					};
				});
				dataCountCall();
			}
		});

		// props.axios_instance
		// 	.get("/sensors", {
		// 		params: { machineName: event.target.getAttribute("data") },
		// 	})
		// 	.then((res) => {
		// 		setSensors(res.data);
		// 		if (res.data[0] == undefined) {
		// 			setX([]);
		// 			setY([]);
		// 		} else if (selectedSensor != res.data[0] && res.data[0] != undefined) {
		// 			setSelectedSensor(res.data[0]);
		// 			console.log("Sensor : " + res.data[0]);
		// 			setX([]);
		// 			setY([]);
		// 			console.log(
		// 				"Sending : " +
		// 					JSON.stringify({
		// 						machineName: event.target.getAttribute("data"),
		// 						sensorName: res.data[0],
		// 					})
		// 			);
		// 			sock.current.send(
		// 				JSON.stringify({
		// 					machineName: event.target.getAttribute("data"),
		// 					sensorName: res.data[0],
		// 					startDate: dateTime,
		// 				})
		// 			);
		// 		} else if (
		// 			selectedMachine != event.target.getAttribute("data") &&
		// 			res.data[0] != undefined
		// 		) {
		// 			setX([]);
		// 			setY([]);
		// 			sock.current.send(
		// 				JSON.stringify({
		// 					machineName: event.target.getAttribute("data"),
		// 					sensorName: res.data[0],
		// 					startDate: dateTime,
		// 				})
		// 			);
		// 		}
		// 	});
	}

	function viewLogClicked() {
		if (viewLog) {
			setLogs([]);
		}
		socketSend(sock, {
			logSubscribed: !viewLog,
			machineName: selectedMachine.machineName,
		});
		setViewLog(!viewLog);
	}

	function sensorTabClicked(event) {
		setSelectedMachine((previousValue) => {
			return {
				...previousValue,
				selectedSensor: event.target.getAttribute("data"),
			};
		});
		dataCountCall();
		// if (selectedMachine.selectedSensor != event.target.getAttribute("data")) {
		// 	setX([]);
		// 	setY([]);
		// 	sock.current.send(
		// 		JSON.stringify({
		// 			machineName: selectedMachine.machineName,
		// 			sensorName: event.target.getAttribute("data"),
		// 			startDate: startDateTime,
		// 		})
		// 	);
		// }
	}

	function downloadCSV() {
		props.axios_instance
			.get("/fetch/csv", { params: { machinename: selectedMachine } })
			.then((res) => {
				console.log(res.data);
				setData(res.data);
			});
		setTimeout(() => {
			csvLink.current.link.click();
		}, 1000);
		// csvLink.current.link.click();
	}

	return (
		<>
			<NavBar
				visible="true"
				title={organization}
				username={username}
				sockets={sockets}
			/>
			<div className="dashboard">
				{machineDetails.length > 0 ? (
					<>
						<div className="control-container">
							<span className="download-control-container control-holders">
								<h1 className="title">Machines Available</h1>
								<div className="download-control-holder">
									<div className="machine_tabs">
										{machineDetails.map((data, index) => {
											return (
												<button
													className="Switcher my-button"
													disabled={
														data.machineName == selectedMachine.machineName
													}
													data={data.machineName}
													onClick={machineTabClicked}
												>
													{data.machineName}
												</button>
											);
										})}
									</div>
									<span className="download-button-holder">
										<button
											className="download_csv my-button"
											onClick={downloadCSV}
										>
											<h4 className="download-content-holder">
												Download data of {selectedMachine.selectedSensor} of{" "}
												{selectedMachine.machineName}
											</h4>
											<i className="down-arrow-download">↓</i>
										</button>
									</span>
								</div>
								<CSVLink
									data={data}
									filename={selectedMachine.machineName + ".csv"}
									className="hidden"
									ref={csvLink}
									target="_blank"
								/>
							</span>
							<span className="chart-control-container control-holders">
								<span className="title-status-holder">
									<h1 className="title">Chart Controls</h1>
									<span className="socket-status-holder">
										{socketDetails.isSocketConnected ? (
											<p className="socket-status-text">Live </p>
										) : (
											<></>
										)}
										{/* <span className="socket-status-dot"></span> */}
									</span>
									<button
										className="my-button view-log-button"
										onClick={viewLogClicked}
									>
										{viewLog ? "Close Log" : "View Log"}
									</button>
								</span>
								<div className="machine_tabs sensor_tab">
									<h3 className="sensorList">Sensors Available : </h3>
									{selectedMachine.sensorType?.split(",").map((data, index) => {
										return (
											<button
												className="Switcher my-button"
												disabled={data == selectedMachine.selectedSensor}
												data={data}
												onClick={sensorTabClicked}
											>
												{data}
											</button>
										);
									})}
								</div>
								<div className="date-timepicker-holder">
									<DateTimePicker
										className="dateTimepicker"
										formatStyle="large"
										style={{
											backgroundColor: "rgb(238, 237, 237)",
											borderRadius: "15px",
										}}
										onChange={(date) =>
											setChartDetails((previous) => ({
												...previous,
												startDate: date,
											}))
										}
										label="Start Datetime"
										value={chartDetails.startDate}
									/>
									<div
										className="change-live"
										style={{ padding: !chartDetails.isLive ? 0 : undefined }}
									>
										<span>
											{!chartDetails.isLive ? (
												<DateTimePicker
													className="dateTimepicker"
													style={{
														backgroundColor: "rgb(238, 237, 237)",
														margin: "0",
														borderRadius: "15px",
													}}
													formatStyle="large"
													onChange={(date) =>
														setChartDetails((previous) => ({
															...previous,
															endDate: date,
														}))
													}
													label="End Datetime"
													value={chartDetails.endDate}
												/>
											) : (
												<>
													<h2 className="live-date-text">Present</h2>
												</>
											)}
										</span>
										<button
											className="live-changer-button"
											style={{
												marginRight: chartDetails.isLive ? 0 : undefined,
											}}
											onClick={() =>
												setChartDetails((previous) => ({
													...previous,
													isLive: !previous.isLive,
												}))
											}
										>
											♻️
										</button>
									</div>
								</div>
								<p className="data-point-count">
									Overall Data points : {dataCount}
								</p>
								<span className="chart-switcher-holder">
									<button
										className="my-button chart-switcher"
										disabled={"bar" === chartDetails.chartType}
										onClick={() =>
											setChartDetails(() => ({
												...chartDetails,
												chartType: "bar",
											}))
										}
									>
										Bar Chart 📊
									</button>
									<button
										className="my-button chart-switcher"
										disabled={"line" === chartDetails.chartType}
										onClick={() =>
											setChartDetails(() => ({
												...chartDetails,
												chartType: "line",
											}))
										}
									>
										Line Chart 📈
									</button>
									<span className="chart-feature-control">
										<CheckboxToggle
											label="Plot from Average"
											value={beginAtZero}
											onChange={(event) => setBeginAtZero(event.target.checked)}
										></CheckboxToggle>
										<CheckboxToggle
											style={{
												display:
													chartDetails.chartType == "line" ? undefined : "none",
											}}
											label="Fill"
											value={lineFill}
											onChange={(event) => setLineFill(event.target.checked)}
										></CheckboxToggle>
									</span>
								</span>
							</span>
						</div>
						<>
							{viewLog ? (
								<span className="console-panel-holder">
									<h1>Logs</h1>
									<h2>{selectedMachine.machineName}</h2>
									<div className="console-command-holder">
										<div className="console-panel">
											<p className="log-container">
												Logs of {selectedMachine.machineName}
											</p>
											<br></br>
											{logs.map((data) => {
												let log = data.log;
												log = log.replace(
													"[INFO]",
													"[<span class='INFO'>INFO</span>]"
												);
												log = log.replace(
													"[WARNING]",
													"[<span class='WARNING'>WARNING</span>]"
												);
												log = log.replace(
													"[ERROR]",
													"[<span class='ERROR'>ERROR</span>]"
												);
												return (
													<p
														className="log-container"
														dangerouslySetInnerHTML={{ __html: log }}
													></p>
												);
											})}
										</div>
										<span className="command-input">
											<p className="command-arrow">&gt;</p>
											<input
												className="command-input-field"
												placeholder="Enter Command"
												onKeyDown={commandKeyDown}
											/>
										</span>
									</div>
								</span>
							) : data.length > 0 ? (
								<>
									{chartDetails.chartType == "line" ? (
										<>
											<div className="chart_container">
												<LineChart
													data={data}
													beginAtZero={beginAtZero}
													fill={lineFill}
												/>
											</div>
										</>
									) : (
										<div className="chart_container">
											<BarChart
												data={data}
												beginAtZero={beginAtZero}
												fill={lineFill}
											/>
										</div>
									)}
								</>
							) : (
								<NoData
									title={`No data in ${selectedMachine.machineName} at ${selectedMachine.selectedSensor} sensor`}
									animFile={noDataAnim}
									marginTop={"3vh"}
									marginBottom={"15vh"}
								/>
							)}
						</>
					</>
				) : (
					<>
						{/* <Player autoplay={true} loop={true} controls={false} src='../assets/noDataAnim.json' /> */}
						<NoData
							title={`No machines in ${organization}`}
							animFile={noDataAnim}
						/>
					</>
				)}
			</div>
		</>
	);
}

export default Dashboard;
