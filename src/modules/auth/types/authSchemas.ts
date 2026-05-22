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

const refineEmailAndRelation = (data: {
	email: string;
	schoolRelation: "STUDENT" | "PROFESSOR" | "GRADUATE";
	academicLevel?: "UNDERGRADUATE" | "POSTGRADUATE" | "MASTER";
	professorType?: "FULL_TIME" | "CHAIR";
	academicProgram?: string;
	semester?: number;
}, ctx: z.RefinementCtx) => {
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
};

const birthDateRequestRefine = (val: string) => {
	const date = new Date(val);
	if (isNaN(date.getTime())) return false;
	const now = new Date();
	const minDate = new Date("1900-01-01");
	return date <= now && date >= minDate;
};

const birthDateFormRefine = (val: string) => {
	const parts = val.split("/");
	if (parts.length !== 3) return false;
	const [year, month, day] = parts.map(Number);
	const date = new Date(year, month - 1, day);
	if (isNaN(date.getTime())) return false;
	if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
		return false;
	}
	const now = new Date();
	const minDate = new Date("1900-01-01");
	return date <= now && date >= minDate;
};

export const registerRequestSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "El nombre completo es requerido.")
		.regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, "El nombre solo puede contener letras y espacios."),
	email: z
		.string()
		.trim()
		.min(1, "Ingresa tu correo.")
		.email("Escribe un correo válido."),
	password: z
		.string()
		.min(1, "Ingresa tu contraseña.")
		.min(8, "La contraseña debe tener al menos 8 caracteres."),
	birthDate: z
		.string()
		.min(1, "La fecha de nacimiento es requerida.")
		.regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe estar en formato YYYY-MM-DD.")
		.refine(birthDateRequestRefine, "La fecha de nacimiento no es válida (el año debe ser 1900 o posterior y no puede ser en el futuro)."),
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
}).superRefine(refineEmailAndRelation);

export const registerFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "El nombre completo es requerido.")
		.regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]+$/, "El nombre solo puede contener letras y espacios."),
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
		.regex(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/, "La fecha debe estar en formato AAAA/MM/DD.")
		.refine(birthDateFormRefine, "La fecha de nacimiento no es válida (el año debe ser 1900 o posterior y no puede ser en el futuro)."),
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
	refineEmailAndRelation(data, ctx);
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