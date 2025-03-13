import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
	useCallback,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { RegisterRequest, User } from "@/types/auth";
import { apiClient } from "@/lib/api-client";
import { createSession, getSession, destroySession } from "@/lib/session";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	register: (formData: RegisterRequest) => Promise<void>;
	logout: () => void;
	verifyEmail: (token: string) => Promise<void>;
	isLoading: boolean;
	handleGoogleAuth: (type: "login" | "signup") => void;
	processGoogleCallback: (searchParams: URLSearchParams) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();

	const processGoogleCallback = useCallback(
		async (searchParams: URLSearchParams) => {
			try {
				setIsLoading(true);

				const error = searchParams.get("error");
				if (error) {
					throw new Error(decodeURIComponent(error));
				}

				const accessToken = searchParams.get("accessToken");
				const refreshToken = searchParams.get("refreshToken");
				const successMessage = searchParams.get("success");
				const redirectPath = searchParams.get("redirect") || "/dashboard";

				if (!accessToken || !refreshToken) {
					throw new Error("Authentication information missing");
				}

				const { data } = await apiClient.get("/auth/profile", {
					headers: { Authorization: `Bearer ${accessToken}` },
				});

				createSession({
					...data.user,
					accessToken: accessToken,
					refreshToken: refreshToken,
				});

				setUser(data.user);
				toast.success(
					decodeURIComponent(successMessage || "Authentication successful!"),
				);
				navigate(redirectPath);
			} catch (error) {
				toast.error(
					error.message ||
						error.message ||
						"Failed to authenticate with Google",
				);
				navigate("/login");
			} finally {
				setIsLoading(false);
			}
		},
		[navigate],
	);

	useEffect(() => {
		const session = getSession();
		if (session?.userData) {
			setUser(session.userData);
		}
		setIsLoading(false);

		if (location.pathname === "/auth/google-callback") {
			const searchParams = new URLSearchParams(location.search);
			processGoogleCallback(searchParams);
		}
	}, [location.pathname, location.search, processGoogleCallback]);

	const login = async (email: string, password: string) => {
		try {
			const response = await apiClient.post("/auth/login", { email, password });
			const { accessToken, refreshToken, data: userData } = response.data;

			createSession({
				...userData,
				accessToken,
				refreshToken,
			});

			setUser(userData);
			toast.success("Successfully logged in!");
			navigate("/dashboard");
		} catch (error) {
			toast.error(error.message || "Login failed");
			throw error;
		}
	};

	const register = async (formData: RegisterRequest) => {
		try {
			await apiClient.post("/auth/register", formData);
			toast.success("Registration successful! Please verify your email.");
			navigate("/login");
		} catch (error) {
			toast.error(error.message || "Registration failed");
			throw error;
		}
	};

	const verifyEmail = async (token: string) => {
		try {
			const { data } = await apiClient.get(
				`/auth/verify-email?token=${token}`,
				{
					timeout: 10000,
				},
			);
			const { accessToken, refreshToken, data: userData } = data;
			createSession({ ...userData, accessToken, refreshToken });
			setUser(userData);
			return data;
		} catch (error) {
			const err = error as { response?: { data?: { error?: string } } };
			const errorMessage = err.response?.data?.error || "Verification failed";
			throw new Error(errorMessage);
		}
	};

	const logout = () => {
		destroySession();
		setUser(null);
		navigate("/login");
		toast.success("Successfully logged out");
	};

	const handleGoogleAuth = (type: "login" | "signup") => {
		window.location.href = `${BACKEND_URL}/auth/google/${type}`;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				register,
				verifyEmail,
				logout,
				isLoading,
				handleGoogleAuth,
				processGoogleCallback,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
