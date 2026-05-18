import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre del equipo debe tener al menos 3 caracteres.")
    .max(50, "El nombre del equipo no puede exceder 50 caracteres."),
  idTournament: z.number().optional().nullable(),
  colors: z
    .string()
    .min(1, "Selecciona un color para el equipo."),
  photo: z.string().optional().default(""),
});

export type CreateTeamFormData = z.infer<typeof createTeamSchema>;

export const updateTeamNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(50, "El nombre no puede exceder 50 caracteres."),
});

export type UpdateTeamNameFormData = z.infer<typeof updateTeamNameSchema>;

/** Validates the raw backend response matches expected shape */
export const teamResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  idTournament: z.number().nullable().optional(),
  captainId: z.number(),
  players: z.array(z.number()),
  currentPlayers: z.number(),
  maxPlayers: z.number(),
  minPlayers: z.number(),
  colors: z.string(),
  photo: z.string(),
  code: z.string().optional(),
  tournamentStatus: z.enum(["NONE", "DRAFT", "ACTIVE", "IN_PROGRESS", "FINISHED"]),
  warning: z.string().optional(),
}).transform((data) => ({
  ...data,
  idTournament: data.idTournament ?? null,
}));
