export default (socket, setLogs, setData, setDataCount, setCondition) => {
	socket.current.onmessage = (message) => {
		message = JSON.parse(message.data);
		console.log("Incoming message : ");
		console.log({ message });
		if (message.to === "logConsole") {
			setLogs((previous) => {
				return [...previous, ...message.data];
			});
		}
		if (message.to === "charts") {
			console.log("got chart data");
			setData((previous) => {
				let newData;
				if (message.newData) {
					newData = [...message.data];
				}
				if (!newData) {
					newData = [...previous, ...message.data];
				}
				setDataCount(newData.length);
				return newData;
			});
		}
		if (message.to === "ml") {
			console.log("got ml data");
			setCondition(parseInt(message.prediction));
		}
	};
};
