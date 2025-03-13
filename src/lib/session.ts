import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { encrypt, decrypt } from "./crypto";
import { Register } from "@tanstack/react-query";

interface Analytics {
	id: string;
	urlId: string;
	referrer: string | null;
	userAgent: string;
	ipAddress: string | null;
	country: string | null;
	city: string | null;
	clickedAt: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

interface UserUrl {
	id: string;
	userId: string;
	shortCode: string;
	originalUrl: string;
	clicks: number;
	analytics: Analytics[];
}

interface UserData {
	id: string;
	firstName: string;
	lastName: string;
	username: string | null;
	email: string;
	isEmailVerified: boolean;
	isActive: boolean;
	lastLogin: string;
	avatar: string | null;
	urls: UserUrl[];
	accessToken: string;
	refreshToken: string;
}

interface SessionData {
	id: string;
	userData: UserData;
	expiresAt: string;
}

const COOKIE_NAME = "session";
const COOKIE_OPTIONS = {
	path: "/",
	secure: import.meta.env.PROD,
	sameSite: "lax",
	expires: 7, // days
};

export function createSession(userData: UserData): string {
	const sessionId = userData.id;
	const sessionData = {
		id: sessionId,
		userData,
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
	};

	const encryptedSession = encrypt(JSON.stringify(sessionData));
	Cookies.set(COOKIE_NAME, encryptedSession, COOKIE_OPTIONS);

	return encryptedSession;
}

export function getSession(): SessionData | null {
	const sessionCookie = Cookies.get(COOKIE_NAME);
	if (!sessionCookie) return null;

	try {
		const decryptedSession = decrypt(sessionCookie);
		const sessionData = JSON.parse(decryptedSession);

		if (new Date(sessionData.expiresAt) < new Date()) {
			destroySession();
			return null;
		}

		return sessionData;
	} catch (error) {
		destroySession();
		return null;
	}
}

export function regenerateSession(): string | null {
	const currentSession = getSession();
	if (!currentSession) return null;

	const newSessionId = currentSession.userData.id;
	const sessionData = {
		...currentSession,
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
	};

	const encryptedSession = encrypt(JSON.stringify(sessionData));
	Cookies.set(COOKIE_NAME, encryptedSession, COOKIE_OPTIONS);

	return newSessionId;
}

export function destroySession(): void {
	Cookies.remove(COOKIE_NAME, { path: "/" });
}
