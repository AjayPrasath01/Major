export default (props, navigate, options) => {
	props.axios_instance
		.get("api/login/status")
		.then((res) => {
			if (options) {
				options.setOrganization(res.data.organization);
				options.setUsername(res.data.username);
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
