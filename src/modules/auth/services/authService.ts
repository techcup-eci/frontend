import {
	loginRequestSchema,
	loginResponseSchema,
	type LoginResponse,
	registerRequestSchema,
	registerResponseSchema,
	type RegisterResponse,
} from "../types/authSchemas";
import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/authSchemas";
import { useAuthStore } from "../hooks/useAuthStore";
import { apiClient } from "../../../core/api/apiClient";

// ── Login ────────────────────────────────────────────────────────────────

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
	const parsed = loginRequestSchema.parse(credentials);

	const response = await apiClient.post("/api/auth/login", {
		email: parsed.email,
		password: parsed.password,
	});

	return loginResponseSchema.parse(response.data);
}

// ── Register ─────────────────────────────────────────────────────────────

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
	const parsed = registerRequestSchema.parse(data);

	const body = {
		email: parsed.email,
		password: parsed.password,
		role: parsed.role,
		name: parsed.fullName,
		schoolRelation: parsed.relationship,
		academicProgram: parsed.program,
		semester: parsed.semester ?? null,
		identificationType: parsed.documentType,
		identificationNumber: parsed.documentNumber,
		birthDate: parsed.birthDate,
	};

	const response = await apiClient.post("/api/auth/register", body);
	return registerResponseSchema.parse(response.data);
}

// ── Logout ───────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
	const token = useAuthStore.getState().accessToken;
	if (!token) return;

	try {
		await apiClient.post("/api/auth/logout");
	} catch {
		// Proceed with local cleanup even if API call fails
	}
}

// ── Role Management ──────────────────────────────────────────────────────

export async function updateRole(userId: number, role: string): Promise<void> {
	await apiClient.patch(`/api/auth/users/${userId}/role`, { role });
}
