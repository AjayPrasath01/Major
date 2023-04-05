import React from "react";

function SummaryValueView(props) {
	return (
		<span className="summary-value-view">
			<h1>{props.value}</h1>
			<h3>{props.name}</h3>
		</span>
	);
}

export default SummaryValueView;
