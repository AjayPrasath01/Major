import React, { useEffect, useState } from "react";
import "./NotificationPanel.css";
import deleteMessages from "./utils/deleteMessages";
import getMessages from "./utils/getMessages";

function NotificationPanel(props) {
	const navBarHeight =
		document.getElementsByClassName("navbar")[0]?.clientHeight;
	const [className, setClassName] = useState("");
	useEffect(() => {
		if (props.viewNotification && props.isNotificationButtonClicked) {
			setClassName("slide-right-left-rightEdge");
			props.setIsNotificationButtonClicked(false);
		} else if (props.isNotificationButtonClicked) {
			props.setIsNotificationButtonClicked(false);
			setClassName("slide-out");
		}
	}, [props.viewNotification]);
	const setViewNotification = () => {
		props.setViewNotification((previous) => {
			return !previous;
		});
		props.setIsNotificationButtonClicked(true);
	};
	const onReloadClicked = () => {
		getMessages(props.axios_instance, props.organization, props.setMessages);
	};

	const onClearButtonClicked = () => {
		deleteMessages(props.axios_instance, props.organization, props.setMessages);
	};
	return (
		<span
			id="notification-panel"
			className={"notification-panel " + className}
			style={{ top: navBarHeight + 30 + "px" }}
		>
			<h1 className="notification-panel-title">
				Notifications{" "}
				<span className="action-container-notification">
					<button
						className="notification-close-button reload-btn"
						onClick={onReloadClicked}
					>
						&#x21bb;
					</button>
					<button
						className="notification-close-button"
						onClick={setViewNotification}
					>
						&#10005;
					</button>
				</span>
			</h1>
			{props.messages.map((message) => {
				if (message === "") {
					return <></>;
				}
				return (
					<div message={message} className="individual-message">
						{message}
					</div>
				);
			})}
			<span className="bottom-space">
				{props.messages.filter((value) => value !== "").length <= 0 ? (
					<span>No Notifications</span>
				) : (
					<button
						className="clear-notification-button"
						onClick={onClearButtonClicked}
					>
						Clear
					</button>
				)}
			</span>
		</span>
	);
}

export default NotificationPanel;
