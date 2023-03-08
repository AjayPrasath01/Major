export default (socket, object) => {
	socket.current?.send(JSON.stringify(object));
};
