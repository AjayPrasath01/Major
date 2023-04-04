import React from "react";
import "./ChartLimit.css";

const CHARTLIMIT = { min: 10, max: 500 };

function ChartLimit({ chartLimit, setChartLimit }) {
	const onLimitChange = (event) => {
		if (event.target.value <= CHARTLIMIT.min) {
			setChartLimit(CHARTLIMIT.min);
		} else if (event.target.value >= CHARTLIMIT.max) {
			setChartLimit(CHARTLIMIT.max);
		} else {
			setChartLimit(event.target.value);
		}
	};
	return (
		<div className="chart-limit">

			<h1>Limit</h1>
			<input type={"number"} min={CHARTLIMIT.min} max={CHARTLIMIT.max} onChange={onLimitChange} value={chartLimit}></input>
		</div>
	);
}

export default ChartLimit;
