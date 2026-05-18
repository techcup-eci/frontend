import axios from "axios";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	const authUser = useAuthStore.getState().user;
	if (authUser?.token && config.headers) {
		const tokenType = authUser.type ?? "Bearer";
		config.headers.Authorization = `${tokenType} ${authUser.token}`;
	}
	return config;
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().setUnauthenticated();
		}
		return Promise.reject(error);
	},
);
