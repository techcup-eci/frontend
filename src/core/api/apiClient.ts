import axios from "axios";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().user?.token;
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
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
