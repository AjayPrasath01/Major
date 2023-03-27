import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import offsetBody from "./utils/offsetBody";

function NavBar(props) {
	const [username, setUsername] = useState("");
	const [organization, setOrganization] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const [isLogoutVisible, setLogoutVisible] = useState(false);
	const navigate = useNavigate();
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

	const handleClick = (event) => {
		if (
			"logout-button" !== event.srcElement.className &&
			"user-icon" !== event.srcElement.className &&
			"userTitle" !== event.srcElement.className
		) {
			console.log("Here", isLogoutVisible);
			setLogoutVisible((previous) => {
				if (previous) {
					return false;
				}
			});
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClick);
		getUsersCall();
		return () => {
			document.removeEventListener("click", handleClick);
		};
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

	const onLogoutlicked = () => {
		props.axios_instance.get("/api/logout").then((result) => {
			navigate("/");
		});
	};
	return (
		<>
			<div
				id="nav-bar"
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
						<span
							className="user-icon"
							id="userIcon"
							onClick={() => setLogoutVisible(!isLogoutVisible)}
						>
							<h1 className="userTitle">
								{username?.slice(0, 2).toUpperCase()}
							</h1>
							{isLogoutVisible ? (
								<span className="dropdown-profile-icon">
									<div class="triangle"></div>
									<button className="logout-button" onClick={onLogoutlicked}>
										Logout
									</button>
								</span>
							) : (
								<></>
							)}
						</span>
					</span>
				</span>
			</div>
		</>
	);
}

export default NavBar;
