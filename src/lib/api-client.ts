import axios from "axios";
import { getSession, regenerateSession, destroySession } from "./session";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL!;

export const apiClient = axios.create({
	baseURL: BACKEND_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const session = getSession();
				const response = await apiClient.post("/auth/token/refresh", {
					refreshToken: session?.userData?.refreshToken,
				});
				const { accessToken } = response.data;

				const currentSession = getSession();
				if (currentSession) {
					currentSession.userData.accessToken = accessToken;
					regenerateSession();
				}

				apiClient.defaults.headers.common[
					"Authorization"
				] = `Bearer ${accessToken}`;
				return apiClient(originalRequest);
			} catch (err) {
				destroySession();
				window.location.href = "/login";
				return Promise.reject(err);
			}
		}
		return Promise.reject(error);
	},
);

apiClient.interceptors.request.use((config) => {
	const session = getSession();
	if (session?.userData?.accessToken) {
		config.headers.Authorization = `Bearer ${session.userData.accessToken}`;
	}
	return config;
});
