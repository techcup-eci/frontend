import { loginRequestSchema, loginResponseSchema, meResponseSchema, registerRequestSchema } from "../types/authSchemas";
import type { AuthUser } from "../types/AuthUser";
import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import { useAuthStore } from "../hooks/useAuthStore";

const BASE_URL = "http://localhost:8080";

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

export async function register(credentials: RegisterRequest): Promise<AuthUser> {
	const parsedCredentials = registerRequestSchema.parse(credentials);
	const response = await fetch(`${BASE_URL}/api/identity/register`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email: parsedCredentials.email,
			password: parsedCredentials.password,
			role: parsedCredentials.role,
		}),
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		if (response.status === 400 || response.status === 409) throw new Error(message ?? "No fue posible registrar el usuario.");
		throw new Error(message ?? "No fue posible registrar el usuario. Intenta de nuevo.");
	}

	const payload = await response.json();
	try {
		return loginResponseSchema.parse(payload);
	} catch {
		throw new Error("El servidor respondió con un formato no válido.");
	}
}

export async function getMe(): Promise<Pick<AuthUser, "email" | "role">> {
	const token = useAuthStore.getState().user?.token;
	if (!token) throw new Error("No hay token disponible.");

	const response = await fetch(`${BASE_URL}/api/identity/me`, {
		method: "GET",
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		if (response.status === 401) throw new Error(message ?? "Token inválido o expirado.");
		throw new Error(message ?? "No fue posible validar el usuario.");
	}

	const payload = await response.json();
	try {
		const userData = meResponseSchema.parse(payload);
		return { email: userData.email, role: userData.role };
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