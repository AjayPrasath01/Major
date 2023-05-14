export default (socket, object) => {
	console.log("Sending message " + JSON.stringify(object));
	socket.current?.send(JSON.stringify(object));
};
