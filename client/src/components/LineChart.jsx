import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import ChartLeftRightControls from "./ChartLeftRightControls.jsx";

ChartJS.register(...registerables);

const LineChart = (props) => {
	const [X, setX] = useState([]);
	const [Y, setY] = useState([]);
	const [offset, setOffset] = useState(0);
	useEffect(() => {
		if (offset === 0) {
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
			setOptions((previous) => {
				return {
					...previous,
					scales: {
						...previous.scales,
						y: {
							...previous.scales.y,
							title: {
								...previous.scales.y.title,
								text: chartData[0]?.data_type,
							},
						},
					},
				};
			});
		}
	}, [props.data, offset]);

	useEffect(() => {
		console.log(ChartJS);
	}, []);

	var data = {
		labels: X,
		datasets: [
			{
				data: Y,
				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	const resetButtonClicked = () => {
		setOffset(0);
	};
	const [options, setOptions] = useState({
		responsive: true,
		plugins: {
			legend: { display: false },
		},
		layout: {
			padding: {
				right: 50, // set the amount of extra space here
			},
		},
		scales: {
			x: {
				// type: "time",
				time: {
					unit: "second",
					displayFormats: {
						hour: "YYYY-MM-DD HH:mm:ss",
					},
				},
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
				min:
					X.length - props.chartLimit > 0
						? X.length - props.chartLimit
						: 0 + offset,
				max: X.length - 1 + offset,
			},

			y: {
				title: {
					display: true,
					text: "Y-Axis",
				},
				beginAtZero: !props.beginAtZero,
				grace: "5%",
			},
		},
	});
	const leftButtonClicked = () => {
		setOffset((previous) => {
			if (X.length - offset > props.chartLimit) {
				previous++;
			}
			return previous;
		});
	};

	const rightButtonClicked = () => {
		setOffset((previous) => {
			if (previous > 0) {
				previous--;
			}
			return previous;
		});
	};
	useEffect(() => {
		setOptions((previous) => {
			if (previous) {
				const newData = {
					...previous,
					scales: {
						...previous.scales,
						x: {
							...previous.scales.x,
							min:
								(X.length - props.chartLimit > 0
									? X.length - props.chartLimit
									: 0) - offset,
							max: X.length - 1 - offset,
						},
					},
				};
				return newData;
			}
		});
	}, [X, offset]);

	useEffect(() => {
		setOffset(0);
		setOptions((previous) => {
			if (previous) {
				const newData = {
					...previous,
					scales: {
						...previous.scales,
						x: {
							...previous.scales.x,
							min:
								X.length - props.chartLimit > 0
									? X.length - props.chartLimit
									: 0,
							max: X.length - 1,
						},
					},
				};
				return newData;
			}
		});
	}, [props.chartLimit]);
	return (
		<div className="chart">
			<h3 className="chartTitle">Bar Chart</h3>
			<ChartLeftRightControls
				offset={offset}
				resetButtonClicked={resetButtonClicked}
				leftButtonClicked={leftButtonClicked}
				rightButtonClicked={rightButtonClicked}
			/>
			<Line data={data} options={options} className="chart-data-viewer" />
		</div>
	);
};

export default LineChart;
