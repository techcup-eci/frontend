import type { AuthUser } from "./AuthUser";

export interface LoginResponse {
	accessToken: string;
	refreshToken?: string;
	tokenType?: string;
	user: AuthUser;
}