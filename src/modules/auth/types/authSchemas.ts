import { z } from "zod";

const backendRoleMap: Record<string, string> = {
	ADMIN: "administrator",
	PLAYER: "participant",
	CAPTAIN: "captain",
	ORGANIZER: "organizer",
	REFEREE: "referee",
	INVITED: "invited",
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

export const loginResponseSchema = z
	.object({
		token: z.string(),
		type: z.string().optional(),
		email: z.string().trim().email(),
		role: authRoleSchema,
		expiresIn: z.number(),
	})
	.transform((data) => ({
		token: data.token,
		email: data.email,
		role: data.role,
		expiresAt: Date.now() + data.expiresIn,
	}));