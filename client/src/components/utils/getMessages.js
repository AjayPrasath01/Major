export default (axios_instance, organization, setMessages) => {
	axios_instance("/api/message/" + organization)
		.then((response) => {
			const messages = response.data.split(",");
			if (messages.filter((value) => value !== "").length > 0) {
				const dot = document.getElementById("notification-dot");
				dot.style.display = "inline-block";
				setMessages(messages);
			}
		})
		.catch((error) => {
			console.log({ error });
		});
};
