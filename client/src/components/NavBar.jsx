import React, { useEffect, useState } from "react";
import "./NavBar.css";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import offsetBody from "./utils/offsetBody";
import NotificationPanel from "./NotificationPanel.jsx";
import getMessages from "./utils/getMessages";
import MenuImg from "../assets/menu.png";
import MobileMenuPanel from "./MobileMenuPanel.jsx";

function NavBar(props) {
	const [username, setUsername] = useState("");
	const [organization, setOrganization] = useState("");
	const [isVisible, setIsVisible] = useState(false);
	const [isLogoutVisible, setLogoutVisible] = useState(false);
	const [viewNotification, setViewNotification] = useState(false);
	const [role, setRole] = useState("visitor");
	const [isNotificationButtonClicked, setIsNotificationButtonClicked] =
		useState(false);
	const navigate = useNavigate();
	const location = useLocation();
	const [messages, setMessages] = useState([]);
	const [isMenuButtonClicked, setIsMenuButtonClicked] = useState(false);
	const [viewMobileMenu, setViewMobileMenu] = useState(false);
	const getUsersCall = () => {
		props.axios_instance
			.get("/api/user")
			.then(({ data }) => {
				console.log(data);
				setUsername(data.username);
				setOrganization(data.organization);
				setRole(data.role);
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

	const onNotificationClicked = () => {
		setViewNotification((previous) => {
			return !previous;
		});
		setIsNotificationButtonClicked(true);
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
						<span
							className="user-icon"
							id="userIcon"
							onClick={() => {
								getMessages(props.axios_instance, organization, setMessages);
								setLogoutVisible(!isLogoutVisible);
							}}
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

									<button
										className="logout-button"
										onClick={onNotificationClicked}
									>
										Notification
										<span
											id="notification-dot"
											className="notification-dot-inner"
										></span>
									</button>
								</span>
							) : (
								<></>
							)}
						</span>
					</span>
				</span>
				<span className="mobile-menu-bar">
					<img
						src={MenuImg}
						width={"25px"}
						height={"25px"}
						onClick={() => {
							getMessages(props.axios_instance, organization, setMessages);
							setViewMobileMenu(!viewMobileMenu);
							setIsMenuButtonClicked(!isMenuButtonClicked);
						}}
					/>
				</span>
				<MobileMenuPanel
					isMenuClicked={isMenuButtonClicked}
					viewMobileMenu={viewMobileMenu}
					setViewMobileMenu={setViewMobileMenu}
					setIsMenuButtonClicked={setIsMenuButtonClicked}
					onLogoutlicked={onLogoutlicked}
					viewNotification={viewNotification}
					isNotificationButtonClicked={isNotificationButtonClicked}
					setViewNotification={setViewNotification}
					setIsNotificationButtonClicked={setIsNotificationButtonClicked}
				/>
			</div>
			<NotificationPanel
				role={role}
				organization={organization}
				setMessages={setMessages}
				axios_instance={props.axios_instance}
				viewNotification={viewNotification}
				isNotificationButtonClicked={isNotificationButtonClicked}
				setViewNotification={setViewNotification}
				setIsNotificationButtonClicked={setIsNotificationButtonClicked}
				messages={messages}
			/>
		</>
	);
}

export default NavBar;
