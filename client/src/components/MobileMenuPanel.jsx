import React, { useEffect, useState } from "react";

function MobileMenuPanel(props) {
	const {
		isMenuClicked,
		viewMobileMenu,
		setIsMenuButtonClicked,
		setViewMobileMenu,
		onLogoutlicked,
		viewNotification,
		isNotificationButtonClicked,
		setViewNotification,
		setIsNotificationButtonClicked,
	} = props;
	const [className, setClassName] = useState("");
	useEffect(() => {
		if (isMenuClicked) {
			if (viewMobileMenu) {
				setClassName("slide-right-left-rightEdge");
			} else {
				setClassName("slide-out");
			}
			setIsMenuButtonClicked(false);
		}
	}, [viewMobileMenu]);
	const closeClicked = () => {
		setIsMenuButtonClicked(true);
		setViewMobileMenu(!viewMobileMenu);
	};
	const onNotificatioViewClicked = () => {
		setIsMenuButtonClicked(true);
		setViewMobileMenu(false);
		setViewNotification((previous) => !previous);
		setIsNotificationButtonClicked((previous) => !previous);
	};
	return (
		<div className={`mobile-menu-holder ${className}`}>
			<div className="mobile-menu-title-holder">
				<h1>Menu</h1>
				<button onClick={closeClicked}>✕</button>
			</div>
			<button className="menu-inner-btn" onClick={onNotificatioViewClicked}>
				Notification
				<span id="notification-dot" className="notification-dot-inner"></span>
			</button>
			<button className="menu-inner-btn" onClick={onLogoutlicked}>
				Logout
			</button>
		</div>
	);
}

export default MobileMenuPanel;
