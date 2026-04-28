import { z } from "zod";

const authRoleValues = ["participant", "captain", "organizer", "referee", "administrator"] as const;

const authRoleSchema = z
	.string()
	.transform((role) => role.trim().toLowerCase())
	.pipe(z.enum(authRoleValues));

const teamSchema = z
	.object({
		id: z.union([z.string(), z.number()]).transform((value) => String(value)).optional(),
		name: z.string().trim().min(1).optional(),
	})
	.partial();

const rawAuthUserSchema = z
	.object({
		id: z.union([z.string(), z.number()]).transform((value) => String(value)),
		fullName: z.string().trim().min(1).optional(),
		name: z.string().trim().min(1).optional(),
		email: z.string().trim().email("El backend retornó un email inválido."),
		role: authRoleSchema,
		teamId: z.union([z.string(), z.number()]).transform((value) => String(value)).nullable().optional(),
		teamName: z.string().trim().min(1).nullable().optional(),
		team: teamSchema.nullable().optional(),
	})
	.transform((rawUser) => ({
		id: rawUser.id,
		fullName: rawUser.fullName ?? rawUser.name ?? rawUser.email,
		email: rawUser.email,
		role: rawUser.role,
		teamId: rawUser.teamId ?? rawUser.team?.id ?? null,
		teamName: rawUser.teamName ?? rawUser.team?.name ?? null,
	}));

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

export const authUserResponseSchema = z
	.union([
		rawAuthUserSchema,
		z.object({
			user: rawAuthUserSchema,
		}),
	])
	.transform((payload) => ("user" in payload ? payload.user : payload));