export type AuthRole =
	| "participant"
	| "captain"
	| "organizer"
	| "referee"
	| "administrator"
	| "invited";

export interface AuthUser {
	email: string;
	role: AuthRole;
	token: string;
	type: string;
	expiresAt: number;
}