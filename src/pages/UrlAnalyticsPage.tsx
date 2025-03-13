
import { useAuth } from "@/hooks/useAuth";
import { UrlAnalytics } from "@/components/url/UrlAnalytics";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";

export default function UrlAnalyticsPage() {
	const { user, isLoading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isLoading && !user) {
			navigate("/login");
		}
	}, [user, isLoading, navigate]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
			</div>
		);
	}

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<UrlAnalytics />
			</main>
		</div>
	);
}
