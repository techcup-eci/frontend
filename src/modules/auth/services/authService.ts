import { loginRequestSchema, loginResponseSchema, meResponseSchema, registerRequestSchema } from "../types/authSchemas";
import type { AuthUser } from "../types/AuthUser";
import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import { useAuthStore } from "../hooks/useAuthStore";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "https://gateway-techcup.nicedesert-e7db8277.eastus.azurecontainerapps.io").replace(/\/$/, "");

type AuthRequestContext = "login" | "register" | "session";

async function extractErrorMessage(response: Response): Promise<string | null> {
	try {
		const payload = (await response.json()) as Record<string, unknown>;
		if (typeof payload.message === "string" && payload.message.trim()) {
			return payload.message;
		}
		if (typeof payload.error === "string" && payload.error.trim()) {
			return payload.error;
		}
		const fieldMessage = Object.values(payload).find((value) => typeof value === "string");
		return typeof fieldMessage === "string" ? fieldMessage : null;
	} catch {
		return null;
	}
}

function resolveAuthErrorMessage(
	response: Response,
	backendMessage: string | null,
	context: AuthRequestContext,
): string {
	if (backendMessage) {
		return backendMessage;
	}

	switch (response.status) {
		case 401:
			return context === "login" ? "Credenciales inválidas." : "Sesión inválida o expirada.";
		case 403:
			return "No tienes permiso para realizar esta acción.";
		case 404:
			return "No se encontró el servicio de autenticación. Verifica que el gateway esté en ejecución.";
		case 502:
		case 503:
		case 504:
			return "El servicio de autenticación no está disponible. Intenta de nuevo en unos momentos.";
		case 500:
			return "Error interno en el servidor. Intenta de nuevo más tarde.";
		case 400:
			return context === "login"
				? "Datos de inicio de sesión incorrectos."
				: context === "register"
					? "Datos de registro incorrectos."
					: "No fue posible validar la sesión.";
		default:
			if (context === "login") {
				return "No fue posible iniciar sesión. Revisa tu conexión e intenta de nuevo.";
			}
			if (context === "register") {
				return "No fue posible registrar el usuario. Intenta de nuevo.";
			}
			return "No fue posible validar la sesión. Intenta iniciar sesión de nuevo.";
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
		throw new Error(resolveAuthErrorMessage(response, message, "login"));
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
		throw new Error(resolveAuthErrorMessage(response, message, "register"));
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
		throw new Error(resolveAuthErrorMessage(response, message, "session"));
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
