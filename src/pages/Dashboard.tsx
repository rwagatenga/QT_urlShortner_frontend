import { useEffect, useState } from "react";
import { ShortenUrlForm } from "@/components/url/ShortenUrlForm";
import { UrlList } from "@/components/url/UrlList";
import { ProfileManager } from "@/components/user/ProfileManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { urlService } from "@/services/urlService";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { UrlInterface, UrlsResponse } from "@/types/url";
import { Header } from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [limit] = useState(10);

	const {
		data: urlsData,
		isLoading,
		isError,
		refetch,
	} = useQuery({
		queryKey: ["urls", page, limit],
		queryFn: () => urlService.getUserUrls(page, limit),
		enabled: !!user,
	});

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const pendingUrl = sessionStorage.getItem("pendingUrl");

		if (pendingUrl && user) {
			const processPendingUrl = async () => {
				try {
					await urlService.shortenUrl({ originalUrl: pendingUrl });
					toast.success("Your URL has been shortened successfully!");
					refetch();
				} catch (error) {
					toast.error("Failed to shorten the URL you entered earlier.");
				}
				sessionStorage.removeItem("pendingUrl");
			};

			processPendingUrl();
		}
	}, [user, navigate, refetch]);

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
	};

	if (!user) return null;

	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Tabs defaultValue="urls" className="space-y-6">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="urls">My URLs</TabsTrigger>
						<TabsTrigger value="create">Shorten URL</TabsTrigger>
						<TabsTrigger value="profile">Profile</TabsTrigger>
					</TabsList>

					<TabsContent value="urls" className="space-y-6">
						<UrlList
							urlsData={urlsData}
							isLoading={isLoading}
							isError={isError}
							page={page}
							onPageChange={handlePageChange}
							refetchUrls={refetch}
						/>
					</TabsContent>

					<TabsContent value="create">
						<ShortenUrlForm onSuccess={refetch} />
					</TabsContent>

					<TabsContent value="profile">
						<ProfileManager />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default Dashboard;
