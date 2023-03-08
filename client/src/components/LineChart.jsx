import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(...registerables);

const LineChart = (props) => {
	const chartData = props.data;
	const X = [];
	const Y = [];
	chartData.forEach((element) => {
		X.push(element.date);
		Y.push(element.value);
	});
    const upMove = useRef(0);
    const downMove = useRef(0);
	const Y_Axis_Name = chartData[0]?.data_type;

	var data = {
		labels: X,
		datasets: [
			{
				data: Y,
                fill: props.fill,
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
	const [options, setOptions] = useState({
		responsive: true,
		legend: { display: false },
		scales: {
			x: {
				title: {
					display: true,
					text: "DateTime",
				},
				grace: "5%",
				// min: 0,
				// max: X.length,
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
	useEffect(() => {
		const chart = document.getElementsByClassName("chart-data-viewer")[0];
        // Scroll effect 

		// chart.addEventListener("wheel", (event) => {
        //     event.preventDefault();
        //     if (event.deltaY > 0){
        //         upMove.current += 1
        //     }
        //     if (event.deltaY < 0){
        //         downMove.current += 1
        //     }
		// 	if (event.deltaY > 0 && upMove.current % 200 === 0) {
        //         // upMove.current = 0;
        //         // downMove.current = 0
		// 		setOptions((previous) => {
		// 			if (previous.scales.x.max >= X.length){
        //                 previous.scales.x.min = X.length - 6
        //                 previous.scales.x.max = X.length
        //             }else {
        //                 previous.scales.x.min = previous.scales.x.min + 1;
        //                 previous.scales.x.max = previous.scales.x.max + 1;
        //             }
		// 			return { ...previous };
		// 		});
		// 	}
        //     else 
        //     if (event.deltaY < 0 && downMove.current % 200 === 0) {
        //         // downMove.current = 0;
        //         // upMove.current = 0;
		// 		setOptions((previous) => {
        //             if (previous.scales.x.min <= 0){
        //                 previous.scales.x.min = 0
        //                 previous.scales.x.max = 6
        //             }else{
        //                 previous.scales.x.min = previous.scales.x.min - 1;
        //                 previous.scales.x.max = previous.scales.x.max - 1;
        //             }
		// 			return { ...previous };
		// 		});
		// 	}
			
		// });
	}, []);
	return (
		<div className="chart">
			<h3 className="chartTitle">Bar Chart</h3>
			<Line data={data} options={options} className="chart-data-viewer" />
		</div>
	);
	// return <></>
};

export default LineChart;
