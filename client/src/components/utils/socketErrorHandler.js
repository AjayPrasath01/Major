export default (socket) => {
	socket.current.onerror = (e) => {
		console.error({ e });
	};
};
