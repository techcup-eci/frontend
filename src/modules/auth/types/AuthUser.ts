export type AuthRole =
	| "participant"
	| "captain"
	| "organizer"
	| "referee"
	| "administrator";

export interface AuthUser {
	id: string;
	fullName: string;
	email: string;
	role: AuthRole;
	teamId?: string | null;
	teamName?: string | null;
}