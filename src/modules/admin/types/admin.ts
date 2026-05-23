export interface AdminUser {
  id: number;
  email: string;
  role: string;
  active: boolean;
}

export type AdminRole =
  | "PLAYER"
  | "CAPTAIN"
  | "ORGANIZER"
  | "REFEREE"
  | "ADMIN"
  | "INVITED";

export const ROLE_LABELS: Record<string, string> = {
  PLAYER: "Jugador",
  CAPTAIN: "Capitán",
  ORGANIZER: "Organizador",
  REFEREE: "Árbitro",
  ADMIN: "Administrador",
  INVITED: "Invitado",
};

export const ASSIGNABLE_ROLES: AdminRole[] = [
  "PLAYER",
  "CAPTAIN",
  "ORGANIZER",
  "REFEREE",
  "ADMIN",
  "INVITED",
];
