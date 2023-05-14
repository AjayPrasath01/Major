import React, { useState, useRef, useEffect } from "react";
import uploadFile from "./utils/uploadFile";
import "./FileUploadElement.css";

function FileUploadElement(props) {
	const { organization, machineName, sensorName: sensor } = props;
	const { sensorName } = props;
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef(null);
	const handleFileInput = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (event) => {
			const csv = event.target.result;
			console.log(csv);
			// const lines = csv.split("\n");
			// const data = lines.map((line) => line.split(","));
			setSelectedFile(csv);
		};
		reader.readAsText(file);
	};

	useEffect(() => {
		setSelectedFile(null);
	}, [sensor]);

	const handleUploadClick = () => {
		fileInputRef.current.click();
	};

	const pushFileToServer = () => {
		if (selectedFile !== "") {
			uploadFile(
				props.axios_instance,
				selectedFile,
				{
					organization,
					sensor,
					machineName,
				},
				`sensor-file-uploar-notifier-${sensorName}`
			);
		}
	};
	return (
		<span className="medium-box dash-border normal-border-radius ml-margin-left flex-column sensor-pallet-padding space-between position-relative">
			<div
				id={`sensor-file-uploar-notifier-${sensorName}`}
				className="position-absolute card-error-sesnor-error-shower"
				style={{ display: "none" }}
			>
				<button className="position-absolute cross-to-close-error-shower">
					X
				</button>
			</div>
			<div className="margin-center ml-label-font-weight">{sensorName}</div>
			<div className="margin-center text-align-center">Sample Failure Data</div>
			<input
				type="file"
				onChange={handleFileInput}
				ref={fileInputRef}
				style={{ display: "none" }}
			/>
			<button className="no-border plus-big" onClick={handleUploadClick}>
				+
			</button>
			{selectedFile !== null ? (
				<button
					className="no-border common-padding background-blue color-white text-bold normal-border-radius"
					onClick={pushFileToServer}
				>
					Push
				</button>
			) : (
				<></>
			)}
		</span>
	);
}

export default FileUploadElement;
