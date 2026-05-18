import { z } from "zod";

const positionValues = [
	"Portero",
	"Defensa Central",
	"Lateral Derecho",
	"Lateral Izquierdo",
	"Mediocampista Defensivo",
	"Mediocampista Central",
	"Extremo Derecho",
	"Extremo Izquierdo",
	"Delantero Centro",
] as const;

const lateralityValues = ["RIGHT", "LEFT", "BOTH"] as const;
const stateValues = ["ACTIVE", "INACTIVE"] as const;

export const athleticProfileSchema = z.object({
	email: z.string().trim().email("Correo inválido."),
	position: z
		.enum(positionValues, {
			errorMap: () => ({ message: "Selecciona una posición válida." }),
		})
		.refine(
			(value) => /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s\-]+$/.test(value),
			"La posición no puede contener caracteres extraños."
		),
	dorsalNumber: z
		.number()
		.int("El dorsal debe ser un número entero.")
		.min(0, "El dorsal no puede ser negativo.")
		.max(99, "El dorsal debe ser menor a 100."),
	laterality: z
		.enum(lateralityValues, {
			errorMap: () => ({ message: "Selecciona una lateralidad válida (Derecha, Izquierda, Ambidiestra)." }),
		})
		.optional()
		.default("RIGHT"),
	stature: z
		.number()
		.min(1.0, "La estatura debe ser mayor a 1 metro (100 cm).")
		.max(3.0, "La estatura debe ser menor a 3 metros (300 cm).")
		.refine(
			(value) => value >= 1.0 && value <= 3.0,
			"La estatura debe estar entre 1.00 m y 3.00 m."
		)
		.optional()
		.default(1.7),
	state: z
		.enum(stateValues, {
			errorMap: () => ({ message: "Selecciona un estado válido (Activo, Inactivo)." }),
		})
		.optional()
		.default("ACTIVE"),
});

export type AthleticProfileFormData = z.infer<typeof athleticProfileSchema>;
