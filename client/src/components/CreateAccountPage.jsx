import React from "react";
import "./LoginPage.css";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordInputField from "./PasswordInputField.jsx";

function CreateAccountPage(props) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [repassword, setRePassword] = useState("");
	const [organization, setOrganization] = useState("");
	const [email, setEmail] = useState("");
	const [selectedRole, setSelectedRole] = useState("visitor");
	const navigation = useNavigate();
	const createAccountClicked = () => {
		const datas = [username, password, repassword, organization, email];

		if (
			!datas.every((element) => typeof element !== undefined && element !== "")
		) {
			const element = document.getElementById("logerror");
			element.innerText = "⛔️ Please enter all credentials";
			element.style.display = "block";
		} else {
			const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!regex.test(email)) {
				const element = document.getElementById("logerror");
				element.innerText = "⛔️ Please enter valid email id";
				element.style.display = "block";
			} else if (password === repassword) {
				props.axios_instance
					.post(
						props.endpoint,
						{
							username,
							password,
							organization,
							email,
						},
						{
							params: {
								role: props.buttonText == "Join" ? selectedRole : undefined,
							},
						}
					)
					.then((res) => {
						console.log(res);
						if (res.status === 200) {
							navigation("/thankyou");
						}
					})
					.catch((error) => {
						if (error.response.status === 409) {
							const element = document.getElementById("logerror");
							element.innerText = `😐 ${error.response.data.message}`;
							element.style.display = "block";
						}
						console.log(error);
					});
			} else {
				const element = document.getElementById("logerror");
				element.innerText = "🚫 Password do not match";
				element.style.display = "block";
			}
		}
	};
	return (
		<div className="loginPage">
			<span className="right_top design"></span>
			<span className="right_bottom design"></span>
			<span className="center1 design"></span>
			<span className="center2 design"></span>
			<span className="center3 design"></span>
			<div className="card">
				<h1 className="title">{props.title}</h1>
				<div className="section-container-create-account">
					<input
						className="input-field-login create-account-input"
						value={username}
						placeholder="Username"
						onChange={(e) => setUsername(e.target.value)}
					></input>
					<input
						className="input-field-login create-account-input"
						value={email}
						placeholder="Email"
						type="text"
						onChange={(e) => setEmail(e.target.value)}
					></input>
				</div>
				<div className="section-container-create-account">
					<PasswordInputField password={password} setPassword={setPassword} />
					<input
						className="input-field-login create-account-input retype-password"
						value={repassword}
						placeholder="Retype Password"
						type="password"
						onChange={(e) => setRePassword(e.target.value)}
					></input>
				</div>
				<div className="section-container-create-account">
					<input
						className="input-field-login"
						style={{ marginLeft: props.buttonText == "Join" ? 0 : "auto" }}
						value={organization}
						placeholder="Organization Name"
						onChange={(e) => setOrganization(e.target.value)}
					></input>
					{props.buttonText == "Join" ? (
						<span className="role-holder">
							<button
								className="my-button role-button"
								onClick={() => setSelectedRole("admin")}
								disabled={"admin" === selectedRole ? true : false}
							>
								Admin
							</button>
							<button
								className="my-button role-button"
								onClick={() => setSelectedRole("visitor")}
								disabled={"visitor" === selectedRole ? true : false}
							>
								Visitor
							</button>
						</span>
					) : (
						<></>
					)}
				</div>
				<button className="my-button" onClick={createAccountClicked}>
					{props.buttonText}
				</button>
				<p id="logerror" className="warning"></p>
				<p className="create-account-text">
					Already have an account?{" "}
					<NavLink to="/" className="link">
						Login
					</NavLink>
				</p>
			</div>
		</div>
	);
}

export default CreateAccountPage;
