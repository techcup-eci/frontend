import { z } from "zod";

export const createTournamentSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres."),
    startDate: z.string().min(1, "La fecha de inicio es obligatoria."),
    endDate: z.string().min(1, "La fecha de finalización es obligatoria."),
    registrationCloseDate: z
      .string()
      .min(1, "El cierre de inscripciones es obligatorio."),
    maxTeams: z
      .number({ invalid_type_error: "El número de equipos debe ser un número." })
      .int("Debe ser un número entero.")
      .min(2, "El número de equipos debe ser al menos 2.")
      .max(32, "El número de equipos no puede superar 32."),
    cost: z
      .number({ invalid_type_error: "El costo debe ser un número." })
      .min(0, "El costo no puede ser negativo."),
    regulationsUrl: z
      .union([z.string().url("Debe ser una URL válida."), z.literal("")])
      .optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "La fecha de finalización debe ser posterior a la fecha de inicio.",
    path: ["endDate"],
  })
  .refine((data) => data.registrationCloseDate < data.endDate, {
    message:
      "El cierre de inscripciones debe ser anterior a la fecha de finalización.",
    path: ["registrationCloseDate"],
  });

export type CreateTournamentFormData = z.infer<typeof createTournamentSchema>;
