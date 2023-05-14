import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, registerables, TimeScale } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartLeftRightControls from "./ChartLeftRightControls.jsx";
import moment from "moment";
import "chartjs-adapter-date-fns";

ChartJS.register(...registerables, TimeScale);

const BarChart = (props) => {
	const [X, setX] = useState([]);
	const [Y, setY] = useState([]);
	const [Y_Axis_Name, setYAxisName] = useState("Y-axis");
	useEffect(() => {
		const chartData = props.data;
		const tempX = [];
		const tempY = [];
		chartData.forEach((element, index) => {
			tempX.push(element.date);
			tempY.push(element.value);
		});
		if (
			JSON.stringify(X) !== JSON.stringify(tempX) ||
			JSON.stringify(Y) !== JSON.stringify(tempY)
		) {
			setX(tempX);
			setY(tempY);
			console.log({ tempX });
		}
		setYAxisName(chartData[0]?.data_type);
	}, [props.data]);

	var data = {
		labels: X,
		datasets: [
			{
				data: Y,
				backgroundColor: [
					"rgba(0, 0, 0, 0.2)",
				],
				borderColor: [
					"rgba(0, 0, 0, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	const resetButtonClicked = () => {
		props.setChartOffset(0);
	};
	const [options, setOptions] = useState({
		responsive: true,
		legend: { display: false },
		layout: {
			padding: {
				right: 50, // set the amount of extra space here
			},
		},
		scales: {
			x: {
				// type: "time",
				// time: {
				// 	unit: "second",
				// 	displayFormats: {
				// 		hour: "YYYY-MM-DD HH:mm:ss",
				// 	},
				// },
				title: {
					display: true,
					text: "DateTime",
				},
				ticks: {
					// callback: function (value, index, values) {
					// 	// return an empty string for every other label
					// 	console.log({ values, value, index, set: X });
					// 	return index % 2 === 0 ? X[index] : "";
					// },
				},
				grace: "5%",
			},

			y: {
				title: {
					display: true,
					text: Y_Axis_Name,
				},
				beginAtZero: !props.beginAtZero,
				grace: "5%",
			},
		},
	});
	const leftButtonClicked = () => {
		console.log(props.chartOffset);
		props.setChartOffset((previous) => {
			return previous - 1;
		});
	};

	const rightButtonClicked = () => {
		props.setChartOffset((previous) => {
			return previous + 1;
		});
	};

	return (
		<div className="chart">
			<h3 className="chartTitle">Bar Chart</h3>
			<ChartLeftRightControls
				offset={props.chartOffset}
				resetButtonClicked={resetButtonClicked}
				leftButtonClicked={leftButtonClicked}
				rightButtonClicked={rightButtonClicked}
			/>
			<Bar data={data} options={options} className="chart-data-viewer" />
		</div>
	);
};

export default BarChart;
