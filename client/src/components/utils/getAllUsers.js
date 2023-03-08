import fetchMachineNames from "./fetchMachineNames";
export default (props, setAllUsers, organization) => {
	props.axios_instance
		.get("/api/getUsers", { params: { organization } })
		.then((res) => {
			setAllUsers(res.data);
		});
};
