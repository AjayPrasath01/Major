export default (axios_instance, organization, setMessages) => {
	axios_instance
		.delete("/api/message/" + organization)
		.then((response) => {
			setMessages([]);
		})
		.catch((error) => {
			console.log(error);
		});
};
