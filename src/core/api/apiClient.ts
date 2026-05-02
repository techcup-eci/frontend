import axios from "axios";
import { useAuthStore } from "../../shared/store/authStore";

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api", // Adjust base URL as needed
	headers: {
		"Content-Type": "application/json",
	},
});

let isRefreshing = false;
let failedQueue: {
	resolve: (value?: unknown) => void;
	reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});

	failedQueue = [];
};

apiClient.interceptors.request.use(
	(config) => {
		const { accessToken } = useAuthStore.getState();
		if (accessToken && config.headers) {
			config.headers.Authorization = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers.Authorization = "Bearer " + token;
						return apiClient(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			isRefreshing = true;

			try {
				// IMPORTANT: Use axios.post directly to avoid an infinite loop in the interceptor
				// if the refresh token endpoint itself returns a 401
				const baseURL =
					import.meta.env.VITE_API_URL || "http://localhost:3000/api";
				const refreshResponse = await axios.post(
					`${baseURL}/auth/refresh`,
					{},
					{
						withCredentials: true, // Assuming refresh token is in a secure httpOnly cookie
					},
				);

				const newAccessToken = refreshResponse.data.accessToken;

				useAuthStore.getState().setAccessToken(newAccessToken);
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

				processQueue(null, newAccessToken);

				return apiClient(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				useAuthStore.getState().clearTokens();
				// window.location.href = '/login'; // Optional redirect
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	},
);
