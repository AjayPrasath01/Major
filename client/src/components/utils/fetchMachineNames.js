export default (props, setDeviceList) => {
    props.axios_instance.get("api/fetch/machineNames").then((res) => {
        setDeviceList(res.data);
        console.log("fetch machine : ", res.data);
    });
}