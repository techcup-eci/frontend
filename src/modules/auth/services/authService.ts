import { loginRequestSchema, loginResponseSchema } from "../types/authSchemas";
import type { AuthUser } from "../types/AuthUser";
import type { LoginRequest } from "../types/LoginRequest";
import { useAuthStore } from "../hooks/useAuthStore";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

async function extractErrorMessage(response: Response) {
	try {
		const payload = (await response.json()) as { message?: string; error?: string };
		return payload.message ?? payload.error ?? null;
	} catch {
		return null;
	}
}

export async function login(credentials: LoginRequest): Promise<AuthUser> {
	const parsedCredentials = loginRequestSchema.parse(credentials);
	const response = await fetch(`${BASE_URL}/api/identity/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email: parsedCredentials.email, password: parsedCredentials.password }),
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		if (response.status === 401) throw new Error(message ?? "Credenciales inválidas.");
		throw new Error(message ?? "No fue posible iniciar sesión. Verifica que tu usuario esté activo.");
	}

	const payload = await response.json();
	try {
		return loginResponseSchema.parse(payload);
	} catch {
		throw new Error("El servidor respondió con un formato no válido.");
	}
}

export async function logout(): Promise<void> {
	const token = useAuthStore.getState().user?.token;
	if (!token) return;
	try {
		await fetch(`${BASE_URL}/api/identity/logout`, {
			method: "POST",
			headers: { Authorization: `Bearer ${token}` },
		});
	} finally {
		useAuthStore.getState().setUnauthenticated();
	}
}