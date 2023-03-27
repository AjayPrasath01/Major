import React from "react";
import "./ControlPanelSectionSelector.css";

function ControlPanelSectionSelector() {
	function scrollTo(section) {
		section.scrollIntoView({
			behavior: "smooth",
			block: "center",
		});
	}
	return (
		<div className="section-selector-holder">
			<span
				className="section-selector"
				onClick={() => scrollTo(document.getElementById("change-password"))}
			>
				CP
			</span>
			<span
				className="section-selector"
				onClick={() => scrollTo(document.getElementById("all-users"))}
			>
				AU
			</span>
			<span
				className="section-selector"
				onClick={() => scrollTo(document.getElementById("handle-data"))}
			>
				HD
			</span>
			<span
				className="section-selector"
				onClick={() => scrollTo(document.getElementById("devices-available"))}
			>
				DA
			</span>
			<span
				className="section-selector"
				onClick={() => scrollTo(document.getElementById("add-machine"))}
			>
				AM
			</span>
		</div>
	);
}

export default ControlPanelSectionSelector;
