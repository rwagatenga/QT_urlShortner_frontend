import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const GoogleCallbackPage = () => {
	const [searchParams] = useSearchParams();
	const { processGoogleCallback, isLoading } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const handleCallback = async () => {
			try {
				const errorParam = searchParams.get("error");
				if (errorParam) {
					throw new Error(decodeURIComponent(errorParam));
				}

				await processGoogleCallback(searchParams);
			} catch (error) {
				setError(error.message);
				toast.error(error.message);
				navigate("/login");
			}
		};

		handleCallback();
	}, [searchParams, processGoogleCallback, navigate]);

	useEffect(() => {
		const urlError = searchParams.get("error");
		if (urlError) {
			setError(decodeURIComponent(urlError));
			setIsProcessing(false);
		}
	}, [searchParams]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
				<Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-xl bg-white/80 shadow-xl">
					<div className="space-y-4 text-center">
						<h2 className="text-2xl font-semibold tracking-tight text-red-500">
							Authentication Error
						</h2>
						<p className="text-sm text-gray-500">{error}</p>
						<div className="flex gap-4 justify-center">
							<Button onClick={() => navigate("/login")}>Go to Login</Button>
							<Button variant="outline" onClick={() => navigate("/signup")}>
								Create Account
							</Button>
						</div>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
			<Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-xl bg-white/80 shadow-xl">
				<div className="space-y-4 text-center">
					<h2 className="text-2xl font-semibold tracking-tight">
						{isLoading || isProcessing ? "Authenticating..." : "Redirecting..."}
					</h2>
					<div className="flex justify-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
					</div>
				</div>
			</Card>
		</div>
	);
};
