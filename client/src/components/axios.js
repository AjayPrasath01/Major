import axios from "axios";
export const SERVER = "http://192.168.1.3:9099";

export const instance = axios.create({
	baseURL: SERVER,
	timeout: 5000,
	withCredentials: true,
});
