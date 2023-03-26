export default (axios_instance, navigate, options) => {
	axios_instance
		.get("api/login/status")
		.then((res) => {
			if (options) {
				if (options.setOrganization) {
					options.setOrganization(res.data.organization);
				}
				if (options.setUsername) {
					options.setUsername(res.data.username);
				}
				if (options.setRole) {
					options.setRole(res.data.role);
				}
			}
		})
		.catch((error) => {
			if (error.response.status === 401) {
				console.log("Logged out");
				navigate("/");
			}
		});
};
