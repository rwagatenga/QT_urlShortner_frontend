import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { urlService } from "@/services/urlService";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";

const COLORS = [
	"#0088FE",
	"#00C49F",
	"#FFBB28",
	"#FF8042",
	"#8884D8",
	"#82CA9D",
];

export const UrlAnalytics = () => {
	const { shortCode } = useParams<{ shortCode: string }>();
	const navigate = useNavigate();

	const { data, isLoading, isError } = useQuery({
		queryKey: ["urlAnalytics", shortCode],
		queryFn: () => urlService.getUrlAnalytics(shortCode || ""),
		enabled: !!shortCode,
		staleTime: 0,
		refetchOnMount: true,
		refetchOnWindowFocus: true,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[500px]">
				<div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
			</div>
		);
	}

	if (isError || !data) {
		return (
			<div className="text-center py-8">
				<p className="text-red-500 mb-4">
					Error loading analytics for this URL.
				</p>
				<Button onClick={() => navigate("/dashboard")}>Back to URLs</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button variant="outline" onClick={() => navigate("/dashboard")}>
					<ArrowLeft className="h-4 w-4 mr-2" />
					Back to URLs
				</Button>
				<Button
					variant="outline"
					onClick={() => window.open(data.originalUrl, "_blank")}
				>
					Visit Original URL
					<ExternalLink className="h-4 w-4 ml-2" />
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>URL Analytics</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<p className="text-sm font-medium mb-1">Short URL:</p>
							<p className="font-mono bg-muted p-2 rounded">
								{window.location.origin}/{data.shortCode}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Original URL:</p>
							<p className="font-mono bg-muted p-2 rounded truncate">
								{data.originalUrl}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium mb-1">Total Clicks:</p>
							<p className="text-2xl font-bold">{data.totalClicks}</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{data.clicksOverTime.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Clicks Over Time</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={data.clicksOverTime}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="date" />
									<YAxis />
									<Tooltip />
									<Bar dataKey="count" fill="#3B82F6" />
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			)}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{data.referrers.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Referrers</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={data.referrers}
											cx="50%"
											cy="50%"
											outerRadius={60}
											dataKey="count"
											nameKey="source"
											label={(entry) => entry.source}
										>
											{data.referrers.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				)}

				{data.browsers.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Browsers</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={data.browsers}
											cx="50%"
											cy="50%"
											outerRadius={60}
											dataKey="count"
											nameKey="name"
											label={(entry) => entry.name}
										>
											{data.browsers.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				)}

				{data.locations.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Locations</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-48">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={data.locations}
											cx="50%"
											cy="50%"
											outerRadius={60}
											dataKey="count"
											nameKey="country"
											label={(entry) => entry.country}
										>
											{data.locations.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={COLORS[index % COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip />
									</PieChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};
