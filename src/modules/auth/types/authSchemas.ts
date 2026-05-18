import { z } from "zod";

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

export const loginResponseSchema = z.object({
	accessToken: z.string(),
	user: z.object({
		id: z.number(),
		email: z.string().email(),
		role: z.string(),
		name: z.string(),
	}),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// ── Registration Schemas ────────────────────────────────────────────────

const systemRoleEnum = z.enum(["INVITED", "PLAYER", "CAPTAIN", "ORGANIZER", "REFEREE", "ADMIN"]);
const relationshipEnum = z.enum(["STUDENT", "TEACHER", "GRADUATE", "STAFF", "FAMILY"]);
const documentTypeEnum = z.enum(["CC", "TI", "CE", "PP"]);

export const registerRequestSchema = z
	.object({
		email: z
			.string()
			.trim()
			.min(1, "Ingresa tu correo.")
			.email("Escribe un correo válido."),
		password: z
			.string()
			.min(1, "Ingresa tu contraseña.")
			.min(8, "La contraseña debe tener al menos 8 caracteres."),
		role: systemRoleEnum,
		fullName: z
			.string()
			.trim()
			.min(3, "El nombre debe tener al menos 3 caracteres."),
		relationship: relationshipEnum,
		program: z
			.string()
			.trim()
			.min(1, "Selecciona tu programa académico."),
		semester: z
			.number()
			.int("El semestre debe ser un número entero.")
			.positive("El semestre debe ser positivo.")
			.optional()
			.nullable(),
		documentType: documentTypeEnum,
		documentNumber: z
			.number({ message: "El número de documento debe ser numérico." })
			.int("El número de documento debe ser entero.")
			.positive("El número de documento debe ser positivo."),
		birthDate: z
			.string()
			.min(1, "Ingresa tu fecha de nacimiento.")
			.refine(
				(val) => {
					const date = new Date(val);
					const minAge = new Date();
					minAge.setFullYear(minAge.getFullYear() - 16);
					return date <= minAge;
				},
				{ message: "Debes tener al menos 16 años." },
			),
	})
	.refine(
		(data) => {
			if (data.relationship === "STUDENT" && (data.semester == null || data.semester <= 0)) {
				return false;
			}
			return true;
		},
		{
			message: "El semestre es requerido para estudiantes.",
			path: ["semester"],
		},
	);

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const registerResponseSchema = z.object({
	accessToken: z.string(),
	user: z.object({
		id: z.number(),
		email: z.string().email(),
		role: z.string(),
		name: z.string(),
	}),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;