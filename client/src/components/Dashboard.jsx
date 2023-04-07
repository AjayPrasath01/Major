import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Dashboard.css";
import { CSVLink } from "react-csv";
import BarChart from "./BarChart.jsx";
import LineChart from "./LineChart.jsx";
import * as SockJS from "sockjs-client";
import {
	CheckboxToggle,
	DateTimePicker,
	RadioButtonGroup,
} from "react-rainbow-components";
import { useNavigate } from "react-router-dom";
import loginStausChecker from "./utils/loginStausChecker";
import noDataAnim from "../assets/noDataAnim.json";
import socketErrorHandler from "./utils/socketErrorHandler";
import socketConnectionOpenHandler from "./utils/socketConnectionOpenHandler";
import socketConnectionClosedHandler from "./utils/socketConnectionClosedHandler";
import socketMessageHandler from "./utils/socketMessageHandler";
import socketSend from "./utils/socketSend";
import NoData from "./NoData.jsx";
import DataPointCounter from "./DataPointCounter.jsx";
import ChartLimit from "./ChartLimit.jsx";
import ScreenSizeNotifier from "./ScreenSizeNotifier.jsx";
import SummaryValueView from "./SummaryValueView.jsx";

function Dashboard(props) {
	const [machineDetails, setMachineDetails] = useState([]);
	const [selectedMachine, setSelectedMachine] = useState({});
	const isMobile = useRef(
		/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
	);
	const [data, setData] = useState([]);
	const [role, setRole] = useState("visitor");
	const [lineFill, setLineFill] = useState(false);
	const [dataCount, setDataCount] = useState(0);
	const [beginAtZero, setBeginAtZero] = useState(true);
	const [viewLog, setViewLog] = useState(false);
	const [logs, setLogs] = useState([]);
	const csvLink = useRef();
	const sock = useRef(null);
	const [chartLimit, setChartLimit] = useState(10);
	const [organization, setOrganization] = useState("");
	const [orientation, setOrientation] = useState(window.orientation);
	const navigate = useNavigate();
	const [summaryDetails, setSummaryDetails] = useState({
		high: "N/A",
		low: "N/A",
		average: "N/A",
		median: "N/A",
		q1: "N/A",
		q3: "N/A",
		iqr: "N/A",
		Range: "N/A",
	});
	const [socketDetails, setSocketDetails] = useState({
		isSocketConnected: false,
	});
	const [chartDetails, setChartDetails] = useState((previous) => {
		const startDate = new Date();
		startDate.setHours(startDate.getHours() - 24);
		return { startDate, endDate: new Date(), chartType: "bar", isLive: true };
	});

	const modeOptions = [
		{ value: "dev", label: "DEV" },
		{ value: "prod", label: "PROD" },
	];
	useEffect(() => {
		const orientationListener = (event) => {
			console.log(orientation);
			setOrientation(window.orientation);
		};

		setTimeout(() => {
			const viewportMeta = document.querySelector('meta[name="viewport"]');
			viewportMeta.setAttribute(
				"content",
				"width=device-width, initial-scale=0.8, maximum-scale=1, user-scalable=0"
			);
		}, 1000);
		window.addEventListener("orientationchange", orientationListener);
		return () => {
			window.removeEventListener("orientationchange", orientationListener);
		};
	}, []);

	const dataCountCall = () => {
		// getDataCounts(
		// 	props.axios_instance,
		// 	selectedMachine,
		// 	setDataCount,
		// 	organization
		// );
	};

	useEffect(() => {
		dataCountCall();
		const sensorMode = selectedMachine.selectedSensor?.split(":");
		if (sensorMode) {
			const socketRequest = {
				isAlive: chartDetails.isLive,
				dataSubscribed: true,
				machineName: selectedMachine.machineName,
				sensor: sensorMode[0],
				startDate: chartDetails.startDate,
				endDate: chartDetails.endDate,
				mode: sensorMode[1],
			};
			if (sock.current?.readyState === 1) {
				socketSend(sock, socketRequest);
			}
		}
	}, [
		selectedMachine,
		sock.current?.readyState,
		chartDetails.startDate,
		chartDetails.endDate,
		chartDetails.isLive,
	]);

	useEffect(() => {
		loginStausChecker(props.axios_instance, navigate, {
			setOrganization,
			setRole,
		});

		props.axios_instance.get(`api/fetch/machineNames`).then((res) => {
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

	useEffect(() => {
		if (organization) {
			sock.current = new SockJS("/ws", {
				headers: { "X-XSRF-TOKEN": props.xsrf },
			});

			socketErrorHandler(sock);
			socketMessageHandler(sock, setLogs, setData, setDataCount);
			socketConnectionOpenHandler(sock, setSocketDetails);
			socketConnectionClosedHandler(sock, setSocketDetails);
			return () => {
				sock.current?.close();
			};
		}
	}, [organization]);

	useEffect(() => {
		function calculateIQR(data) {
			// First, sort the data array in ascending order
			if (data.length > 1) {
				data.sort((a, b) => a - b);

				// Find the median (Q2) of the dataset
				let median;
				if (data.length % 2 === 0) {
					median =
						(data[Math.round(data.length / 2 - 1)] +
							data[Math.round(data.length / 2)]) /
						2;
				} else {
					median = data[Math.floor(Math.round(data.length / 2))];
				}

				// Find the lower quartile (Q1)
				let q1;
				if (data.length % 4 === 1) {
					q1 = data[Math.round((data.length + 1) / 4 - 1)];
				} else {
					q1 =
						(data[Math.round((data.length + 1) / 4 - 1)] +
							data[Math.round(data.length / 4)]) /
						2;
				}

				// Find the upper quartile (Q3)
				let q3;
				if (data.length % 4 === 1) {
					q3 = data[Math.round((3 * (data.length + 1)) / 4 - 1)];
				} else {
					q3 =
						(data[Math.round((3 * data.length) / 4 - 1)] +
							data[Math.round((3 * data.length) / 4)]) /
						2;
				}
				// Calculate the IQR
				let iqr = q3 - q1;
				iqr = iqr.toFixed(2);
				q3 = q3.toFixed(2);
				q1 = q1.toFixed(2);
				median = median.toFixed(2);

				return {
					q1,
					median,
					q3,
					iqr,
				};
			} else {
				return {
					q1: "N/A",
					median: "N/A",
					q3: "N/A",
					iqr: "N/A",
				};
			}
		}

		if (data.length > 0) {
			const Y = data.map((value) => parseFloat(value.value));
			let high = Math.max(...Y);
			high = high.toFixed(2);

			// To find the lowest number
			let low = Math.min(...Y);

			low = low.toFixed(2);

			// To find the average
			const sum = Y.reduce((acc, val) => acc + val, 0);
			let average = sum / Y.length;

			if (average % 1 === 0) {
				average = average.toFixed(2) + "0";
			} else {
				average = average.toFixed(2);
			}

			let Variance =
				Y.reduce((sum, val) => sum + (val - average) ** 2, 0) / Y.length;
			let stdDev = Math.sqrt(Variance);

			Variance.toFixed(2);
			stdDev.toFixed(2);

			Range = parseFloat(high) - parseFloat(low);
			Range = Range.toFixed(2);

			setSummaryDetails({ high, low, average, ...calculateIQR(Y), Range });
		} else {
			setSummaryDetails({
				high: "N/A",
				low: "N/A",
				average: "N/A",
				median: "N/A",
				q1: "N/A",
				q3: "N/A",
				iqr: "N/A",
				Range: "N/A",
			});
		}
	}, [data]);

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

	function onModeChange() {
		setSelectedMachine((previous) => {
			const mode = previous.selectedSensor.split(":")[1];
			if (mode == "dev") {
				previous.selectedSensor = previous.selectedSensor.replace(
					"dev",
					"prod"
				);
			} else {
				previous.selectedSensor = previous.selectedSensor.replace(
					"prod",
					"dev"
				);
			}
			return { ...previous };
		});
	}

	return (
		<>
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
										{console.log({ length: data.length })}
										<button
											className="download_csv my-button"
											onClick={downloadCSV}
											style={data.length <= 0 ? { display: "none" } : undefined}
										>
											<h4 className="download-content-holder">
												Download data of{" "}
												{selectedMachine.selectedSensor.split(":")[0]} of{" "}
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
												disabled={
													data?.split(":")[0] ==
													selectedMachine.selectedSensor.split(":")[0]
												}
												data={data}
												onClick={sensorTabClicked}
											>
												{data?.split(":")[0]}
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
								<DataPointCounter count={dataCount} />
								<RadioButtonGroup
									className="mode-picker"
									value={selectedMachine.selectedSensor.split(":")[1]}
									options={modeOptions}
									onChange={onModeChange}
								/>
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
						<div className="container dashboard">
							<h1>Summary</h1>
							<div className="summary-details-holder">
								<SummaryValueView value={summaryDetails.high} name={"High"} />
								<SummaryValueView value={summaryDetails.low} name={"Low"} />
								<SummaryValueView value={summaryDetails.Range} name={"Range"} />
								<SummaryValueView
									value={summaryDetails.average}
									name={"Average"}
								/>
								<SummaryValueView
									value={summaryDetails.median}
									name={"Median"}
								/>
								<SummaryValueView value={summaryDetails.q1} name={"Q1"} />
								<SummaryValueView value={summaryDetails.q3} name={"Q3"} />
								<SummaryValueView value={summaryDetails.iqr} name={"IQR"} />
							</div>
						</div>
						<>
							{viewLog ? (
								<span className="console-panel-holder">
									<h1>Logs</h1>
									<h2>{selectedMachine.machineName}</h2>
									<div className="console-command-holder">
										<div
											className="console-panel"
											style={
												role === "visitor"
													? { borderRadius: "10px" }
													: undefined
											}
										>
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
										{role === "visitor" ? (
											<></>
										) : (
											<span className="command-input">
												<p className="command-arrow">&gt;</p>
												<input
													className="command-input-field"
													placeholder="Enter Command"
													autofocus={!isMobile}
													onKeyDown={commandKeyDown}
												/>
											</span>
										)}
									</div>
								</span>
							) : data.length > 0 ? (
								<div className="chart_container">
									<ScreenSizeNotifier />
									<ChartLimit
										chartLimit={chartLimit}
										setChartLimit={setChartLimit}
									/>
									<>
										{chartDetails.chartType == "line" ? (
											<>
												<LineChart
													chartLimit={chartLimit}
													data={data}
													beginAtZero={beginAtZero}
													fill={lineFill}
												/>
											</>
										) : (
											<BarChart
												chartLimit={chartLimit}
												data={data}
												beginAtZero={beginAtZero}
												fill={lineFill}
											/>
										)}
									</>
								</div>
							) : (
								<NoData
									title={`No data in ${selectedMachine.machineName} at ${
										selectedMachine.selectedSensor.split(":")[0]
									} sensor`}
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
