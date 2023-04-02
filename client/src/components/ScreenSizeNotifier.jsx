import React from "react";
import "./ScreenSizeNotifier.css";
import RotateImage from "../assets/rotation.png";

function ScreenSizeNotifier() {
	return (
		<div className="screen-size-notifier-holder">
			<div className="screen-size-notifier-content">
				<img className="rotate-image" src={RotateImage} />
				<span className="rotate-message">Rotate your device to landscape to view the chart</span>
			</div>
		</div>
	);
}

export default ScreenSizeNotifier;
