import axios from "axios";
export const SERVER = undefined;

export const instance = axios.create({
	baseURL: SERVER,
	timeout: 5000,
	withCredentials: true,
});
