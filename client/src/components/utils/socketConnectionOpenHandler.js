export default (socket, setSocketDetails) => {
	socket.current.onopen = (event) => {
		setSocketDetails((previousValue) => {
			return { ...previousValue, isSocketConnected: true };
		});
		console.log("Socket is connected");
	};
};
