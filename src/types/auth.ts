
export interface RegisterRequest {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	password: string;
}

export interface UserInterface {
	id?: string;
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	isEmailVerified?: boolean;
	emailVerificationToken?: string | null;
	isActive: boolean;
	lastLogin?: Date;
	avatar?: string | null;
	googleId?: string | null;
	role?: string;
	createdAt?: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	data: UserInterface;
	accessToken: string;
	refreshToken: string;
}

export interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	avatar?: string;
	role?: string;
	isVerified?: boolean;
	createdAt?: string;
}

export interface UpdateUserRequest {
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	role?: string;
}
