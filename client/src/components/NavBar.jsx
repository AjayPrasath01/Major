import React from "react";
import "./NavBar.css";
import { useState } from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";

function NavBar(props) {
	const [profileClickEvent, setProfileClickEvent] = useState(null);
	function killSockets() {
		console.log("kill sockets");
		console.log(props.sockets.current);
		if (props.sockets.current.length > 0) {
			props.sockets.current.map((value) => {
				value.current.close();
				console.log("Kiling heart beat of id ");
			});
		}
	}
	return (
		<div className="navbar">
			<span className="logo-container">
				<p className="logo">{props.title}</p>
			</span>
			<span>
				<span>
					{props.visible == "true" ? (
						<>
							<NavLink to="/dashboard" className="links">
								Dashboard
							</NavLink>
							<NavLink
								to={{
									pathname: "/controlpanel",
								}}
								onClick={killSockets}
								className="links"
							>
								Control Panel
							</NavLink>
						</>
					) : (
						<></>
					)}
					{/* <span className='theme_toggle'>Light Mode</span> */}
					<span
						className="user-icon"
						id="userIcon"
						onClick={setProfileClickEvent}
					>
						<h1 className="userTitle">
							{props.username.slice(0, 2).toUpperCase()}
						</h1>
					</span>
				</span>
			</span>
		</div>
	);
}

export default NavBar;
