import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ChevronLeft,
	ChevronRight,
	Link,
	BarChart2,
	Clipboard,
	CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { UrlsResponse, UrlInterface } from "@/types/url";

interface UrlListProps {
	urlsData: UrlsResponse | undefined;
	isLoading: boolean;
	isError: boolean;
	page: number;
	onPageChange: (page: number) => void;
	refetchUrls: () => void;
}

export const UrlList = ({
	urlsData,
	isLoading,
	isError,
	page,
	onPageChange,
	refetchUrls,
}: UrlListProps) => {
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const navigate = useNavigate();

	const handleNextPage = () => {
		if (urlsData && page < urlsData.pagination.totalPages) {
			onPageChange(page + 1);
		}
	};

	const handlePreviousPage = () => {
		if (page > 1) {
			onPageChange(page - 1);
		}
	};

	const copyToClipboard = (url: string, id: string) => {
		navigator.clipboard.writeText(url);
		setCopiedId(id);
		setTimeout(() => {
			setCopiedId(null);
		}, 2000);
	};

	const viewAnalytics = (shortCode: string) => {
		navigate(`/analytics/${shortCode}`);
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-40">
				<div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-center py-4 text-red-500">
				Error loading your URLs. Please try again later.
			</div>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your Shortened URLs</CardTitle>
			</CardHeader>
			<CardContent>
				{urlsData && urlsData.urls.length > 0 ? (
					<>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Original URL</TableHead>
										<TableHead>Short URL</TableHead>
										<TableHead>Clicks</TableHead>
										<TableHead>Created</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{urlsData.urls.map((url) => (
										<TableRow key={url.id}>
											<TableCell
												className="max-w-xs truncate"
												title={url.originalUrl}
											>
												<Link className="h-4 w-4 inline mr-2" />
												{url.originalUrl.length > 30
													? url.originalUrl.substring(0, 30) + "..."
													: url.originalUrl}
											</TableCell>
											<TableCell>{url.shortCode}</TableCell>
											<TableCell>{url.clicks}</TableCell>
											<TableCell>
												{formatDistanceToNow(new Date(url.createdAt), {
													addSuffix: true,
												})}
											</TableCell>
											<TableCell>
												<div className="flex space-x-2">
													<Button
														variant="outline"
														size="sm"
														onClick={() =>
															copyToClipboard(url.shortUrl, url.id)
														}
													>
														{copiedId === url.id ? (
															<CheckCircle className="h-4 w-4" />
														) : (
															<Clipboard className="h-4 w-4" />
														)}
													</Button>
													<Button
														variant="outline"
														size="sm"
														onClick={() => viewAnalytics(url.shortCode)}
													>
														<BarChart2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{urlsData.pagination.totalPages > 1 && (
							<div className="flex justify-between items-center mt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={handlePreviousPage}
									disabled={page === 1}
								>
									<ChevronLeft className="h-4 w-4 mr-2" />
									Previous
								</Button>
								<span className="text-sm">
									Page {page} of {urlsData.pagination.totalPages}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={handleNextPage}
									disabled={page === urlsData.pagination.totalPages}
								>
									Next
									<ChevronRight className="h-4 w-4 ml-2" />
								</Button>
							</div>
						)}
					</>
				) : (
					<div className="text-center py-8">
						<p className="text-gray-500 mb-4">
							You don't have any shortened URLs yet.
						</p>
						<Button onClick={() => navigate("/dashboard")}>
							Shorten Your First URL
						</Button>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
