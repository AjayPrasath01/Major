import axios from "axios";
export const SERVER = "http://172.20.10.2:9099";

export const instance = axios.create({
	baseURL: SERVER,
	timeout: 5000,
	withCredentials: true,
});
