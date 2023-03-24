import React from "react";
import {
	CheckboxToggle,
	DateTimePicker,
	RadioButtonGroup,
	InternalDropdown,
} from "react-rainbow-components";
import "./css/DataModifierSection.css";

function DataModifierSection() {
	return (
		<div className="container">
			<h1 className="subtitle">Handle Data</h1>
			<div className="modifier-function-holder">
				<span>
					<DateTimePicker
						className="dateTimepicker"
						formatStyle="large"
						style={{
							backgroundColor: "rgb(238, 237, 237)",
							borderRadius: "15px",
						}}
						label="Start Datetime"
					/>

					<DateTimePicker
						className="dateTimepicker"
						formatStyle="large"
						style={{
							backgroundColor: "rgb(238, 237, 237)",
							borderRadius: "15px",
						}}
						label="End Datetime"
					/>
				</span>
				<span>
					<InternalDropdown
						label="Dropdown"
						placeholder="Select an option"
						options={[
							{ value: "option1", label: "Option 1" },
							{ value: "option2", label: "Option 2" },
							{ value: "option3", label: "Option 3" },
						]}
					/>
				</span>
			</div>
		</div>
	);
}

export default DataModifierSection;
