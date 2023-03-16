import axios from "axios";
export const SERVER = "http://10.5.155.48:9099";

export const instance = axios.create({
	baseURL: SERVER,
	timeout: 5000,
	withCredentials: true,
});
