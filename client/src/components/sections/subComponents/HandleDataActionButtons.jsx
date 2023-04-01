import React from "react";

function HandleDataActionButtons(props) {
	return (
		<button
			className={`my-button dev data-handler-button ${
				props.className ? props.className : ""
			}`}
			onClick={props.onClick}
		>
			{props.name}
			<span
				id={props.tickId}
				className="count-selected-data-handler-holder tick-notifier"
			>
				<span className="count-selected-data-handler">✓</span>
			</span>
			{props.selectedCount > 0 ? (
				<span className="count-selected-data-handler-holder">
					<span className="count-selected-data-handler">
						{props.selectedCount}
					</span>
				</span>
			) : (
				<></>
			)}
		</button>
	);
}

export default HandleDataActionButtons;
