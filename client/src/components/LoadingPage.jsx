import React from "react";
import "./LoadingPage.css";
import Lottie from "react-lottie-player";
import loading from "../assets/loading.json";
import loadingText from "../assets/loading-text.json";
function LoadingPage() {
	return (
		<div className="loading-page-holder">
			<Lottie
				loop
				animationData={loading}
				play
				style={{
					width: "20vw",
					height: "20vh",
					marginLeft: "auto",
					marginRight: "auto",
				}}
			/>
			<div class="word-animation">
				<span>L</span>
				<span>o</span>
				<span>a</span>
				<span>d</span>
				<span>i</span>
                <span>n</span>
                <span>g</span>
                <span>.</span>
                <span>.</span>
                <span>.</span>
			</div>
		</div>
	);
}

export default LoadingPage;
