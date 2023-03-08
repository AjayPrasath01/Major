export default (socket, setSocketDetails) => {
	socket.current.onclose = (event) => {
		setSocketDetails((previousValue) => {
			return { ...previousValue, isSocketConnected: false };
		});
		console.log("Socket connection lost");
		socket.current = null;
	};
};
