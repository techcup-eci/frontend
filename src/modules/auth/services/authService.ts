import { authUserResponseSchema, loginRequestSchema } from "../types/authSchemas";
import type { AuthUser } from "../types/AuthUser";
import type { LoginRequest } from "../types/LoginRequest";

const DEFAULT_API_URL = "http://localhost:8080";

function getApiBaseUrl() {
	const configuredUrl = import.meta.env.VITE_API_URL;
	return (configuredUrl && configuredUrl.trim().length > 0 ? configuredUrl : DEFAULT_API_URL).replace(/\/$/, "");
}

async function extractErrorMessage(response: Response) {
	try {
		const payload = (await response.json()) as { message?: string; error?: string };
		return payload.message ?? payload.error ?? null;
	} catch {
		return null;
	}
}

function parseAuthUserPayload(payload: unknown): AuthUser {
	try {
		return authUserResponseSchema.parse(payload);
	} catch {
		throw new Error("El servidor respondió con un formato de usuario no válido.");
	}
}

export async function login(credentials: LoginRequest): Promise<AuthUser> {
	const parsedCredentials = loginRequestSchema.parse(credentials);
	const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
		body: JSON.stringify(parsedCredentials),
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new Error(message ?? "No fue posible iniciar sesión con las credenciales ingresadas.");
	}

	const payload = await response.json();
	const user = parseAuthUserPayload(payload);

	// TODO: eliminar esto cuando el microservicio de usuarios asigne roles correctamente
	return { ...user, role: "organizer" };
}

export async function getCurrentUser(): Promise<AuthUser> {
	const response = await fetch(`${getApiBaseUrl()}/auth/me`, {
		method: "GET",
		credentials: "include",
	});

	if (!response.ok) {
		if (response.status === 401) {
			throw new Error("Sesión no activa.");
		}

		const message = await extractErrorMessage(response);
		throw new Error(message ?? "No fue posible consultar la sesión actual.");
	}

	const payload = await response.json();
	return parseAuthUserPayload(payload);
}