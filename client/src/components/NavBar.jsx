import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import offsetBody from "./utils/offsetBody";
import { useLocation } from "react-router-dom";

function NavBar(props) {
	const [username, setUsername] = useState("");
	const [organization, setOrganization] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const location = useLocation();
	const getUsersCall = () => {
		props.axios_instance
			.get("/api/user")
			.then(({ data }) => {
				console.log(data);
				setUsername(data.username);
				setOrganization(data.organization);
			})
			.catch((error) => {
				// Do nothing
			});
	};
	useEffect(() => {
		getUsersCall();
	}, []);

	useEffect(() => {
		console.log(location.pathname);
		if (
			location.pathname === "/dashboard" ||
			location.pathname === "/controlpanel"
		) {
			console.log("Setting visible");
			if (!username || !organization) {
				getUsersCall();
			}
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}
		console.log(window.location.hash);
	}, [location.pathname]);

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
								{username?.slice(0, 2).toUpperCase()}
							</h1>
						</span>
					</span>
				</span>
			</div>
		</>
	);
}

export default NavBar;
