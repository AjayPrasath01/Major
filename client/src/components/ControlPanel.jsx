import React from "react";
import "./ControlPanel.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fileDownload from "js-file-download";
import loginStausChecker from "./utils/loginStausChecker";
import fetchMachineNames from "./utils/fetchMachineNames";
import addSensor from "./utils/addSensor";
import getAllUsers from "./utils/getAllUsers";
import SensorIndividualContainer from "./SensorIndividualContainer.jsx";
import extractSensorFromRaw from "./utils/extractSensorFromRaw";
import DataModifierSection from "./sections/DataModifierSection.jsx";
import ControlPanelSectionSelector from "./ControlPanelSectionSelector.jsx";
function ControlPanel(props) {
	const navigate = useNavigate();
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [retypedPassword, setRetypedPassword] = useState("");
	const [username, setUsername] = useState("");
	const [deviceList, setDeviceList] = useState([]);
	const [organization, setOrganization] = useState("");
	const location = useLocation();
	const [allUsers, setAllUsers] = useState([]);
	const [role, setRole] = useState("visitor");
	const [addDeviceDetails, setAddDeviceDetails] = useState({
		machineName: "",
		wifi: true,
		sensors: "",
	});

	useEffect(() => {
		if (organization && organization !== "") {
			getAllUsers(props, setAllUsers, organization);
			fetchMachineNames(props.axios_instance, setDeviceList);
		}
	}, [organization]);

	useEffect(() => {
		loginStausChecker(props.axios_instance, navigate, {
			setOrganization,
			setUsername,
			location,
			setRole,
		});
	}, []);

	function change_password() {
		const element = document.getElementById("cp_message");
		element.innerText = "Please wait";
		element.style.display = "block";
		element.style.color = "orange";
		if (newPassword == "") {
			element.innerText = "Please enter a valid password";
			element.style.display = "block";
			element.style.color = "red";
		} else if (newPassword === retypedPassword) {
			console.log("Here " + username);
			props.axios_instance
				.patch("/api/login/changePassword", {
					username,
					currentPassword,
					newPassword,
					organization,
				})
				.then((res) => {
					if (res.status == 200) {
						element.innerText = "Changed Successfully !!!";
						element.style.display = "block";
						element.style.color = "green";
					}
				})
				.catch((res) => {
					if (res.response.status == 401) {
						element.innerText = "Wrong Password";
						element.style.display = "block";
						element.style.color = "red";
					}
				});
		} else {
			element.innerText = "Password Mismatch";
			element.style.display = "block";
			element.style.color = "red";
		}
	}

	function unBlockUser(event) {
		const data = JSON.parse(event.target.getAttribute("data"));
		console.log(data);
		props.axios_instance
			.post("/api/unblockUsers", { username: data.username, organization })
			.then((res) => {
				if (res.status == 200) {
					const element = document.getElementById("table_status");
					element.style.display = "block";
					element.style.color = "green";
					element.innerText = "Unblocked the User";
				}
				getAllUsers(props, setAllUsers, organization);
			})
			.catch((err) => {
				const element = document.getElementById("table_status");
				element.style.display = "block";
				element.style.color = "red";
				element.innerText =
					err.response.data.message !== undefined
						? err.response.data.message
						: "Oops Somthing went wrong";
				console.log(err);
			});
	}

	function blockUser(event) {
		console.log(event.target.getAttribute("data"));
		const data = JSON.parse(event.target.getAttribute("data"));
		props.axios_instance
			.delete("/api/block/user", {
				data: { username: data.username, organization },
			})
			.then((res) => {
				props.axios_instance.get(props.server + "/getNewUsers").then((res) => {
					// setNewUserList(res.data);
				});
				if (res.status == 200) {
					const element = document.getElementById("table_status");
					element.style.display = "block";
					element.style.color = "orange";
					element.innerText = "Blocked the user Successfully";
				}
				getAllUsers(props, setAllUsers, organization);
			})
			.catch((err) => {
				const element = document.getElementById("table_status");
				element.style.display = "block";
				element.style.color = "red";
				element.innerText = err.response.data.message;
			});
	}

	function addSensorClicked(event) {
		let old_data = undefined;
		let new_data = undefined;
		if (event.key === "Enter") {
			old_data = JSON.parse(event.target.getAttribute("data"));
			new_data = event.target.value;
			event.target.value = "";
			console.log("entered");
		} else if (event.target.nodeName === "BUTTON") {
			old_data = JSON.parse(event.target.getAttribute("data"));
			new_data = event.target.parentNode.querySelector("input").value;
			event.target.parentNode.querySelector("input").value = "";
		}
		if (event.target.nodeName === "BUTTON" || event.key === "Enter") {
			old_data.sensorType = old_data.sensorType.split(",").map((element) => {
				if (element !== event.target.getAttribute("rawsensor")) {
					element = extractSensorFromRaw(element);
					return element;
				}
			});
			old_data.sensorType = old_data.sensorType.join(",");
			old_data.sensorType += `,${new_data}`;
			old_data.organization = organization;
			console.log({ old_data });
			addSensor(
				props.axios_instance,
				{
					sensors: old_data.sensorType,
					machineName: old_data.machineName,
					organization,
				},
				setDeviceList
			);
		}
	}

	function removeSensorClicked(event) {
		const data = JSON.parse(event.target.getAttribute("data"));
		const previousLength = data.sensorType;
		data.sensorType = data.sensorType.split(",").map((element) => {
			if (element !== event.target.getAttribute("rawsensor")) {
				element = extractSensorFromRaw(element);
				return element;
			}
		});
		data.sensorType = data.sensorType.join(",");
		addSensor(
			props.axios_instance,
			{
				sensors: data.sensorType,
				machineName: data.machineName,
				organization,
			},
			setDeviceList
		);
	}

	function removeDevice(event) {
		props.axios_instance
			.delete("/api/remove/machine", {
				data: { machineName: event.target.getAttribute("data"), organization },
			})
			.then((res) => {
				const element = document.getElementById("table_status3");
				element.style.display = "block";
				element.style.color = "orange";
				element.innerText = "Device removed Successfully !!!";

				fetchMachineNames(props.axios_instance, setDeviceList);
			})
			.catch((err) => {
				console.log(err);
				const element = document.getElementById("table_status3");
				element.style.display = "block";
				element.style.color = "red";
				element.innerText = err.response.data.message;
			});
	}

	function addDeviceRemoveSensor(event) {
		const toBeRemoced = event.target.getAttribute("data");
		console.log({ toBeRemoced });
		setAddDeviceDetails((previous) => {
			const beforeLength = previous.sensors.length;
			previous.sensors = previous.sensors.replace("," + toBeRemoced + ",", ",");
			let afterLength = previous.sensors.length;
			if (beforeLength === afterLength) {
				previous.sensors = previous.sensors.replace("," + toBeRemoced, "");
			}
			afterLength = previous.sensors.length;
			if (beforeLength === afterLength) {
				previous.sensors = previous.sensors.replace(toBeRemoced, "");
			}
			previous.sensors += ".";
			return { ...previous };
		});
	}

	function addDeviceSensorAdder(event) {
		let new_data = undefined;
		if (event.key === "Enter") {
			new_data = event.target.value;
			event.target.value = "";
		} else if (event.target.nodeName === "BUTTON") {
			new_data = event.target.parentNode.querySelector("input").value;
			event.target.parentNode.querySelector("input").value = "";
		}
		if (new_data) {
			new_data = new_data.toLowerCase();
			const waring_element = document.getElementById("gen_error");
			console.log({ sensors: new_data });
			if (
				!addDeviceDetails.sensors.split(",").some((sensor) => {
					sensor = sensor.replaceAll(".", "");
					return sensor.toLowerCase() == new_data;
				})
			) {
				waring_element.style.display = "none";
				setAddDeviceDetails((previous) => {
					if (
						!addDeviceDetails.sensors.split(",").some((sensor) => {
							sensor = sensor.replaceAll(".", "");
							return sensor.toLowerCase() == new_data;
						})
					) {
						previous.sensors = previous.sensors.replaceAll(".", "");
						if (previous.sensors == "") {
							previous.sensors += new_data;
						} else {
							previous.sensors += "," + new_data;
						}
						previous.sensors += ".";
					}
					return { ...previous };
				});
			} else {
				waring_element.style.display = "block";
				waring_element.innerText = "Sensor name can't be repeated 🚫";
				waring_element.style.color = "red";
			}
		}
	}

	function generatecodeClicked() {
		console.log({ addDeviceDetails });
		if (addDeviceDetails.machineName != "" && addDeviceDetails.sensors != "") {
			const element = document.getElementById("gen_error");
			props.axios_instance
				.post("/api/addDevice", {
					...addDeviceDetails,
					organization,
					sensors: addDeviceDetails.sensors.replaceAll(".", ""),
				})
				.then((res) => {
					if (res.status == 200) {
						fileDownload(res.data, "ArduinoSD.ino");
						element.style.display = "none";
					}
					fetchMachineNames(props.axios_instance, setDeviceList);
					setAddDeviceDetails(() => {
						return { machineName: "", wifi: true, sensors: "" };
					});
				})
				.catch((err) => {
					const message = err.response?.data?.message;
					if (err.response.status == 409) {
						const element = document.getElementById("gen_error");
						element.style.display = "block";
						element.style.color = "red";
						if (message) {
							element.innerText = message;
						} else {
							element.innerText = "Conflict error";
						}
					} else if (err.response.status == 400) {
						const element = document.getElementById("gen_error");
						element.style.display = "block";
						element.style.color = "red";
						element.innerText = "Bad request";
					} else {
						element.style.display = "block";
						element.style.color = "red";
						if (err.message) {
							element.innerText = err.message;
						} else {
							element.innerText = "Something when wrong";
						}
					}
				});
		} else {
			const element = document.getElementById("gen_error");
			element.style.display = "block";
			element.style.color = "red";
			element.innerText = "Please enter a valid machine name and sensor";
		}
	}

	return (
		<div id="control-panel-body">
			<ControlPanelSectionSelector />
			<div className="container">
				<div className="cp">
					<h1 id="change-password" className="subtitle">Change Password</h1>
					<div>
						<label>Current Password</label>
						<input
							className="input-change-password"
							value={currentPassword}
							onChange={(event) => setCurrentPassword(event.target.value)}
							type="password"
						></input>
					</div>

					<div>
						<label>New Password</label>
						<input
							className="input-change-password"
							value={newPassword}
							onChange={(event) => setNewPassword(event.target.value)}
							type="password"
						></input>
					</div>

					<div>
						<label>Retype Password</label>
						<input
							className="input-change-password"
							value={retypedPassword}
							onChange={(event) => setRetypedPassword(event.target.value)}
							type="password"
						></input>
					</div>

					<button
						onClick={change_password}
						className="my-button change_password"
					>
						Change
					</button>
					<p id="cp_message">Changed Successfully !!</p>
				</div>
			</div>
			{role !== "admin" ? (
				<></>
			) : (
				<>
					<div className="container">
						<div className="nu">
							<h1 id="all-users" className="subtitle">All Users</h1>
							{allUsers.length == 0 ? (
								<h3 className="no_data">No new Requests found</h3>
							) : (
								<>
									<table className="table">
										<thead>
											<tr>
												<td>Username</td>
												<td>Role</td>
												<td>Actions</td>
											</tr>
										</thead>
										<tbody>
											{allUsers.map((data) => {
												return (
													<tr>
														<td>{data.username}</td>
														<td>{data.role}</td>
														<td>
															{data.isActive ? (
																<button
																	data={JSON.stringify(data)}
																	className="table_button my-button"
																	onClick={blockUser}
																	disabled={username === data.username}
																>
																	🚫
																</button>
															) : (
																<button
																	data={JSON.stringify(data)}
																	className="table_button my-button"
																	onClick={unBlockUser}
																>
																	&#10004;
																</button>
															)}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</>
							)}
							<p id="table_status"></p>
						</div>
					</div>
					<DataModifierSection machines={deviceList} />
					<div className="container">
						<div className="dl">
							<h1 id="devices-available" className="subtitle">Devices Available</h1>
							{deviceList.length == 0 ? (
								<h3 className="no_data">No devices found</h3>
							) : (
								<>
									<table className="table">
										<thead>
											<tr>
												<td>Username</td>
												<td>Sensors</td>
												<td>Actions</td>
											</tr>
										</thead>
										<tbody>
											{deviceList.map((data) => {
												return (
													<tr className="tablerow">
														<td style={{ fontWeight: 900 }}>
															{data["machineName"]}
														</td>
														{/* <td>{data["sensorType"]}</td> */}
														<td className="middle-column">
															<span className="sensors-column">
																{data.sensorType.split(",").map((sensor) => {
																	return (
																		<SensorIndividualContainer
																			sensor={sensor}
																			removeSensorClicked={removeSensorClicked}
																			data={data}
																			mode={data.mode}
																			setDeviceList={setDeviceList}
																			axios_instance={props.axios_instance}
																			organization={organization}
																		/>
																	);
																})}
															</span>
															<span className="add-sensor-holder">
																<input
																	className="sensor-input"
																	placeholder="Add Sensor"
																	onKeyDown={addSensorClicked}
																	data={JSON.stringify(data)}
																></input>
																<button
																	className="sensor-input"
																	data={JSON.stringify(data)}
																	onClick={addSensorClicked}
																>
																	✔
																</button>
															</span>
														</td>
														<td className="action-column">
															<button
																data={data["machineName"]}
																disabled={data.username === "admin"}
																className="table_button my-button"
																onClick={(event) => removeDevice(event)}
															>
																&#10060;
															</button>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</>
							)}
							<p id="table_status3"></p>
						</div>
					</div>

					<div className="container last-container">
						<div className="cg">
							<h1 id="add-machine" className="subtitle">Add Machine</h1>
							<div className="machinename">
								<label className="add-device-label">Machine Name : </label>
								<input
									type="text"
									className="input-change-password input-add-device"
									placeholder="Enter Machine name"
									value={addDeviceDetails.machineName}
									onChange={(event) =>
										setAddDeviceDetails((previous) => {
											console.log(event.target.value);
											return { ...previous, machineName: event.target.value };
										})
									}
								></input>
							</div>
							<div className="wifitype">
								<label className="add-device-label">Sensors : </label>
								<div className="sensor-input add-device-sensor-area">
									<span>
										{addDeviceDetails.sensors.split(",").map((sensor) => {
											if (sensor === "" || sensor === ".") {
												// return <>Some thing</>;
											} else {
												return (
													<>
														<span className="sensor-individual-holder add-device-individual-holder">
															<p className="sensor-name-holder">
																{sensor?.replaceAll(".", "")}
															</p>
															<button
																className="remove-sensor-button"
																data={sensor}
																onClick={addDeviceRemoveSensor}
															>
																⛔️
															</button>
														</span>
													</>
												);
											}
										})}
										<input
											placeholder="Add sensor"
											className="sensor-input"
											onKeyDown={addDeviceSensorAdder}
										></input>
										<button
											className="sensor-input add-device-sensor-button"
											onClick={addDeviceSensorAdder}
										>
											✔
										</button>
									</span>
								</div>
							</div>

							<div>
								<span className="input-add-device-wifi">
									<div className="ssid_c">
										<label className="wifi-labels">SSID -&gt; </label>
										<input
											type="text"
											className="input-change-password input-add-device"
											placeholder="Enter SSID"
											onChange={(event) =>
												setAddDeviceDetails((previous) => {
													return { ...previous, ssid: event.target.value };
												})
											}
										></input>
									</div>
									<div className="pass_c password-wifi">
										<label className="wifi-labels">Password -&gt; </label>
										<input
											type="password"
											className="input-change-password input-add-device"
											placeholder="Enter Wifi Password"
											onChange={(event) =>
												setAddDeviceDetails((previous) => {
													return {
														...previous,
														password: event.target.value,
													};
												})
											}
										></input>
									</div>
								</span>
							</div>

							<button
								className="generate_button my-button"
								onClick={generatecodeClicked}
							>
								Generate
							</button>
							<p id="gen_error"></p>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

export default ControlPanel;
