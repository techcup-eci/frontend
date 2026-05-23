import axios from "axios";
import { useAuthStore } from "../../modules/auth/hooks/useAuthStore";

// ── Base client ──────────────────────────────────────────────────────────

export const apiClient = axios.create({
	baseURL: (import.meta.env.VITE_API_URL ?? "http://localhost:8081").replace(/\/$/, ""),
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// ── Request interceptor: attach access token ─────────────────────────────

apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;
	if (token && config.headers) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// ── 401 retry queue ─────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: unknown) => void;
	reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
	for (const { resolve, reject } of failedQueue) {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	}
	failedQueue = [];
}

// ── Response interceptor ─────────────────────────────────────────────────

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8081").replace(/\/$/, "");

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Only handle 401; pass everything else through
		if (error.response?.status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		// Never retry auth endpoints (prevents infinite loops)
		if (
			originalRequest.url?.includes("/api/auth/refresh") ||
			originalRequest.url?.includes("/api/auth/login") ||
			originalRequest.url?.includes("/api/auth/register")
		) {
			return Promise.reject(error);
		}

		// If already refreshing, queue this request
		if (isRefreshing) {
			return new Promise((resolve, reject) => {
				failedQueue.push({
					resolve: (token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(apiClient(originalRequest));
					},
					reject,
				});
			});
		}

		// Start refresh
		originalRequest._retry = true;
		isRefreshing = true;

		try {
			// Use native fetch() to avoid intercepting ourselves
			const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
				method: "POST",
				credentials: "include",
			});

			if (!refreshRes.ok) {
				throw new Error("Refresh failed");
			}

			const data = await refreshRes.json();
			useAuthStore.getState().setAuthenticated(data.accessToken, data.user);
			const newToken = data.accessToken;

			processQueue(null, newToken);
			originalRequest.headers.Authorization = `Bearer ${newToken}`;
			return apiClient(originalRequest);
		} catch (refreshError) {
			processQueue(refreshError, null);
			useAuthStore.getState().setUnauthenticated();
			window.location.href = "/login";
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
		}
	},
);
