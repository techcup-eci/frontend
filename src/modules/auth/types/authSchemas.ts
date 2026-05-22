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
	name: z
		.string()
		.trim()
		.min(1, "El nombre completo es requerido.")
		.regex(/^[^0-9]+$/, "El nombre no puede contener números."),
	email: z
		.string()
		.trim()
		.min(1, "Ingresa tu correo.")
		.email("Escribe un correo válido."),
	password: z
		.string()
		.min(1, "Ingresa tu contraseña.")
		.min(8, "La contraseña debe tener al menos 8 caracteres."),
	confirmPassword: z.string().min(1, "Confirma tu contraseña."),
	birthDate: z
		.string()
		.min(1, "La fecha de nacimiento es requerida.")
		.refine((val) => {
			const date = new Date(val);
			if (isNaN(date.getTime())) return false;
			const now = new Date();
			const minDate = new Date();
			minDate.setFullYear(now.getFullYear() - 130);
			return date <= now && date >= minDate;
		}, "La fecha de nacimiento no es válida (máximo 130 años de edad y no puede ser en el futuro)."),
	schoolRelation: z.enum(["STUDENT", "PROFESSOR", "GRADUATE"], {
		errorMap: () => ({ message: "Selecciona una relación con la escuela válida." }),
	}),
	academicLevel: z.enum(["UNDERGRADUATE", "POSTGRADUATE", "MASTER"]).optional(),
	professorType: z.enum(["FULL_TIME", "CHAIR"]).optional(),
	academicProgram: z.string().optional(),
	semester: z.number().optional(),
	identificationType: z.enum(["CC", "TI", "PP", "CE", "OTRO"], {
		errorMap: () => ({ message: "Selecciona un tipo de identificación válido." }),
	}),
	identificationNumber: z.number({
		required_error: "El número de identificación es requerido.",
		invalid_type_error: "El número de identificación debe ser un valor numérico.",
	}).refine((val) => val >= 1000000000 && val <= 9999999999, {
		message: "El documento debe tener exactamente 10 dígitos.",
	}),
	phone: z.number({
		required_error: "El teléfono es requerido.",
		invalid_type_error: "El teléfono debe ser un valor numérico.",
	}).refine((val) => val >= 1000000000 && val <= 9999999999, {
		message: "El teléfono debe tener exactamente 10 dígitos.",
	}),
}).superRefine((data, ctx) => {
	if (data.password !== data.confirmPassword) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Las contraseñas no coinciden.",
			path: ["confirmPassword"],
		});
	}

	const emailLower = data.email.toLowerCase();
	if (data.schoolRelation === "PROFESSOR") {
		const isValid = emailLower.endsWith("@escuelaing.edu.co") || emailLower.endsWith("@gmail.com");
		if (!isValid) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Para profesores, el correo debe terminar en @escuelaing.edu.co o @gmail.com",
				path: ["email"],
			});
		}
	} else if (data.schoolRelation === "STUDENT") {
		const isValid = emailLower.endsWith("@mail.escuelaing.edu.co") || emailLower.endsWith("@gmail.com");
		if (!isValid) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Para estudiantes, el correo debe terminar en @mail.escuelaing.edu.co o @gmail.com",
				path: ["email"],
			});
		}
	} else if (data.schoolRelation === "GRADUATE") {
		const isValid = emailLower.endsWith("@gmail.com");
		if (!isValid) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Para invitados, el correo debe terminar en @gmail.com",
				path: ["email"],
			});
		}
	}

	if (data.schoolRelation === "STUDENT") {
		if (!data.academicLevel) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "El nivel académico es requerido para estudiantes.",
				path: ["academicLevel"],
			});
		} else if (data.academicLevel === "UNDERGRADUATE") {
			if (!data.academicProgram) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "El programa académico es requerido para estudiantes de pregrado.",
					path: ["academicProgram"],
				});
			}
			if (data.semester === undefined || data.semester < 1 || data.semester > 10) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: "El semestre debe estar entre 1 y 10.",
					path: ["semester"],
				});
			}
		}
	} else if (data.schoolRelation === "PROFESSOR") {
		if (!data.professorType) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "El tipo de profesor es requerido para profesores.",
				path: ["professorType"],
			});
		}
	}
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