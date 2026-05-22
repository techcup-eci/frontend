import { z } from "zod";

const backendRoleMap: Record<string, string> = {
	ADMIN: "administrator",
	PLAYER: "participant",
	CAPTAIN: "captain",
	ORGANIZER: "organizer",
	REFEREE: "referee",
	INVITED: "invited",
	USER: "participant",
};

const authRoleValues = ["participant", "captain", "organizer", "referee", "administrator", "invited"] as const;

const authRoleSchema = z
	.string()
	.transform((role) => backendRoleMap[role.trim().toUpperCase()] ?? role.trim().toLowerCase())
	.pipe(z.enum(authRoleValues));

export const loginRequestSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Ingresa tu correo institucional o registrado.")
		.email("Escribe un correo válido."),
	password: z
		.string()
		.min(1, "Ingresa tu contraseña.")
		.min(8, "La contraseña debe tener al menos 8 caracteres."),
	rememberMe: z.boolean().optional(),
});

export const registerRequestSchema = z.object({
	email: z
		.string()
		.trim()
		.min(1, "Ingresa tu correo institucional o registrado.")
		.email("Escribe un correo válido."),
	password: z
		.string()
		.min(1, "Ingresa tu contraseña.")
		.min(8, "La contraseña debe tener al menos 8 caracteres."),
	role: z
		.string()
		.trim()
		.default("USER")
		.transform((value) => value.toUpperCase()),
	fullName: z
		.string()
		.trim()
		.min(1, "El nombre completo es requerido.")
		.regex(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s'-]+$/, "El nombre solo puede contener letras, espacios, guiones y apóstrofes."),
});

export const loginResponseSchema = z
	.object({
		accessToken: z.string(),
		expiresIn: z.number(),
		user: z.object({
			id: z.number(),
			email: z.string().trim().email(),
			role: authRoleSchema,
			name: z.string(),
		}),
	})
	.transform((data) => ({
		token: data.accessToken,
		type: "Bearer",
		email: data.user.email,
		role: data.user.role,
		id: data.user.id,
		name: data.user.name,
		expiresAt: Date.now() + data.expiresIn,
	}));

export const meResponseSchema = z.object({
	email: z.string().trim().email(),
	role: authRoleSchema,
});