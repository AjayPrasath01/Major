import React from "react";
import "./LoginPage.css";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordInputField from "./PasswordInputField";

function LoginPage(props) {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [organization, setOrganization] = useState("");

	function keyPressed(event) {
		if (event.key === "Enter") {
			login();
		}
	}

	function login() {
		if (username === "" || username === undefined) {
			const element = document.getElementById("logerror");
			element.innerText = "Please enter the Username";
			element.style.display = "block";
		} else if (password === "" || password === undefined) {
			const element = document.getElementById("logerror");
			element.innerText = "Please enter the Password";
			element.style.display = "block";
		} else if (organization === "" || organization === undefined) {
			const element = document.getElementById("logerror");
			element.innerText = "Please enter the Organization";
			element.style.display = "block";
		} else {
			console.log("Login in details is being sent");
			props.axios_instance
				.post("/api/login", { username, password, organization })
				.then((res) => {
					console.log(res);
					if (res.status == 200) {
						navigate("/dashboard", { username, organization });
					}
				})
				.catch((err) => {
					if (!err.response) {
						const element = document.getElementById("logerror");
						element.innerText = "Can't reah the server";
						element.style.display = "block";
					} else if (err.response.status === 401) {
						const element = document.getElementById("logerror");
						element.innerText = err.response.data.message;
						element.style.display = "block";
					} else if (err.response.status === 404) {
						const element = document.getElementById("logerror");
						element.innerText = "Server can't be reached";
						element.style.display = "block";
					}
					console.log(err);
				});
		}
	}
	return (
		<div className="loginPage">
			<span className="right_top design"></span>
			<span className="right_bottom design"></span>
			<span className="center1 design"></span>
			<span className="center2 design"></span>
			<span className="center3 design"></span>
			<div className="card">
				<h1 className="title">Login</h1>
				<div className="section-container-create-account">
					<input
						className="input-field-login create-account-input"
						value={username}
						placeholder="Username"
						onKeyDown={keyPressed}
						onChange={(e) => setUsername(e.target.value)}
					></input>
					<PasswordInputField
						password={password}
						keyPressed={keyPressed}
						setPassword={setPassword}
					/>
				</div>
				<input
					className="input-field-login"
					value={organization}
					placeholder="Organization"
					onKeyDown={keyPressed}
					type="text"
					onChange={(e) => setOrganization(e.target.value)}
				></input>
				<button className="my-button" onClick={() => login()}>
					Login
				</button>
				<p id="logerror" className="warning"></p>
				<p className="create-account-text">
					Need a account?{" "}
					<NavLink
						to={{
							pathname: "/createAccount",
						}}
						className="link"
					>
						Create Account
					</NavLink>
				</p>
				<p className="create-account-text">
					Join a organization?{" "}
					<NavLink
						to={{
							pathname: "/join",
						}}
						className="link"
					>
						Join
					</NavLink>
				</p>
			</div>
		</div>
	);
}

export default LoginPage;
