import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import offsetBody from "./utils/offsetBody";

function NavBar(props) {
	const [username, setUsername] = useState("");
	const [organization, setOrganization] = useState("");
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		props.axios_instance
			.get("/api/user")
			.then(({ data }) => {
				console.log(data);
				setUsername(data.username);
				setOrganization(data.organization);
			})
			.catch((error) => {
				// TODO
			});
	}, []);

	useEffect(() => {
		if (
			window.location.hash === "#/dashboard" ||
			window.location.hash === "#/controlpanel"
		) {
			console.log("Setting visible");
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
		console.log(window.location.hash);
	}, [window.location.hash]);

	useEffect(() => {
		offsetBody();
	}, [isVisible]);
	return (
		<>
			<div
				className="navbar"
				style={isVisible ? undefined : { display: "none" }}
			>
				<span className="logo-container">
					<p className="logo">{organization}</p>
				</span>
				<span>
					<span>
						<NavLink to="/dashboard" className="links">
							Dashboard
						</NavLink>
						<NavLink
							to={{
								pathname: "/controlpanel",
							}}
							className="links"
						>
							Control Panel
						</NavLink>

						{/* <span className='theme_toggle'>Light Mode</span> */}
						<span className="user-icon" id="userIcon">
							<h1 className="userTitle">
								{username.slice(0, 2).toUpperCase()}
							</h1>
						</span>
					</span>
				</span>
			</div>
		</>
	);
}

export default NavBar;
