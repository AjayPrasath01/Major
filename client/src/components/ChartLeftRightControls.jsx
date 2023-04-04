import React from "react";
import "./ChartLeftRightControls.css";

function ChartLeftRightControls(props) {
	return (
		<>
			<button className="chart-button left" onClick={props.leftButtonClicked}>
				<svg
					fill="currentColor"
					width="6.46px"
					height="30px"
					viewBox="0 0 6.46 10"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M0.239130435,4.47204969 L4.46273292,0.248447205 C4.75465839,-0.0434782609 5.22670807,-0.0434782609 5.51552795,0.248447205 L6.2173913,0.950310559 C6.50931677,1.24223602 6.50931677,1.71428571 6.2173913,2.00310559 L3.22670807,5 L6.22049689,7.99378882 C6.51242236,8.28571429 6.51242236,8.75776398 6.22049689,9.04658385 L5.51863354,9.7515528 C5.22670807,10.0434783 4.75465839,10.0434783 4.46583851,9.7515528 L0.242236025,5.52795031 C-0.0527950311,5.23602484 -0.0527950311,4.76397516 0.239130435,4.47204969 Z"></path>
				</svg>
			</button>
			<button className="chart-button right" onClick={props.rightButtonClicked}>
				<svg
					fill="currentColor"
					width="6.46px"
					height="30px"
					viewBox="0 0 6.46 10"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M6.22049689,5.52795031 L1.99689441,9.7515528 C1.70496894,10.0434783 1.23291925,10.0434783 0.944099379,9.7515528 L0.242236025,9.04968944 C-0.049689441,8.75776398 -0.049689441,8.28571429 0.242236025,7.99689441 L3.23602484,5.00310559 L0.242236025,2.00931677 C-0.049689441,1.7173913 -0.049689441,1.24534161 0.242236025,0.956521739 L0.940993789,0.248447205 C1.23291925,-0.0434782609 1.70496894,-0.0434782609 1.99378882,0.248447205 L6.2173913,4.47204969 C6.51242236,4.76397516 6.51242236,5.23602484 6.22049689,5.52795031 Z"></path>
				</svg>
			</button>
			<button
				className="my-button reset-button-chart"
				onClick={props.resetButtonClicked}
				disabled={props.offset === 0}
			>
				&#8594;
			</button>
		</>
	);
}

export default ChartLeftRightControls;
