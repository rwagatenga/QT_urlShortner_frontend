import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

const VerifyEmail = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { verifyEmail } = useAuth();
	const token = searchParams.get("token");

	const { isLoading, isError, error, isSuccess, data } = useQuery({
		queryKey: ["verifyEmail", token],
		queryFn: () =>
			token ? verifyEmail(token) : Promise.reject("No token provided"),
		enabled: !!token,
		retry: 0,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		staleTime: Infinity,
		gcTime: 0,
	});

	useEffect(() => {
		if (!token) {
			toast.error("Verification token is missing.");
			navigate("/login");
		} else if (isSuccess) {
			toast.success("Email verified successfully!");
			const timer = setTimeout(() => {
				navigate("/dashboard");
			}, 3000);
			return () => clearTimeout(timer);
		} else if (isError) {
			toast.error((error as Error)?.message || "Verification failed");

			const timer = setTimeout(() => {
				navigate("/login");
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [token, navigate, isSuccess, isError, data, error]);

	return (
		<div className="flex items-center justify-center h-screen">
			<div className="text-center p-8 max-w-md">
				{isLoading && (
					<>
						<div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
						<p className="text-xl">Verifying your email, please wait...</p>
					</>
				)}

				{isSuccess && (
					<p className="text-xl text-green-600">
						Email verified successfully! Redirecting...
					</p>
				)}

				{isError && (
					<p className="text-xl text-red-600">
						Verification failed. Redirecting to login...
					</p>
				)}
			</div>
		</div>
	);
};

export default VerifyEmail;
