import React from "react";
import Lottie from "react-lottie-player";
function NoData(props) {
	const marginTop = props.marginTop;
	const marginBottom = props.marginBottom;
	return (
		<div>
			<Lottie
				loop
				animationData={props.animFile}
				play
				style={{
					width: "50vw",
					height: "50vh",
					marginLeft: "auto",
					marginRight: "auto",
					marginTop: marginTop ? marginTop : "15vh",
				}}
			/>
			<h1 className="no-data-title" style={{ marginBottom }}>
				{props.title}
			</h1>
		</div>
	);
}

export default NoData;
