import React, { useState, useRef, useEffect } from "react";
import "./ScreenSizeNotifier.css";
import RotateImage from "../assets/rotation.png";

function ScreenSizeNotifier() {
	const [orientation, setOrientation] = useState(window.orientation);
	const [screenWidth, setScreenWidth] = useState(window.innerWidth);
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);
	const isMobile = useRef(
		/iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
	);

	console.log({ device: window.navigator.userAgent, isMobile });
	useEffect(() => {
		console.log({ screenWidth });
		function handleOrientationChange() {
			setOrientation(window.orientation);
		}

		function handleResize() {
			setScreenWidth(window.innerWidth);
			setScreenHeight(window.innerHeight);
		}

		window.addEventListener("resize", handleResize);

		window.addEventListener("orientationchange", handleOrientationChange);
		return () => {
			window.removeEventListener("orientationchange", handleOrientationChange);
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	return (
		<div
			className="screen-size-notifier-holder"
			style={
				orientation === 90 || orientation === 180 || screenWidth > 1000
					? { display: "none" }
					: undefined
			}
		>
			<div className="screen-size-notifier-content">
				{isMobile.current ? (
					<>
						<img className="rotate-image" src={RotateImage} />
						<span className="rotate-message">
							Rotate your device to landscape to view the chart
						</span>
					</>
				) : (
					<>
						<span className="rotate-message">
							Sorry need a bigger screen to display charts 😐
						</span>
					</>
				)}
			</div>
		</div>
	);
}

export default ScreenSizeNotifier;
