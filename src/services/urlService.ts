import { apiClient } from "@/lib/api-client";
import {
	ShortenUrlRequest,
	UrlInterface,
	UrlAnalytics,
	UrlsResponse,
	ApiAnalyticsEntry,
	ApiAnalyticsResponse,
	ApiClickByDay,
	ApiCountryStat,
	ApiReferrerStat,
} from "@/types/url";

export const urlService = {
	shortenUrl: async (urlData: ShortenUrlRequest): Promise<UrlInterface> => {
		const response = await apiClient.post("/url/shorten", urlData);
		return response.data;
	},

	getUserUrls: async (
		page: number = 1,
		limit: number = 10,
	): Promise<UrlsResponse> => {
		const response = await apiClient.get(
			`/url/urls?page=${page}&limit=${limit}`,
		);
		return response.data;
	},
	getUrlAnalytics: async (shortCode: string): Promise<UrlAnalytics> => {
		const response = await apiClient.get<ApiAnalyticsResponse>(
			`/url/analytics/${shortCode}`,
		);
		const data = response.data.data;

		const browserCounts: Record<string, number> = {};
		data.analytics.forEach((entry: ApiAnalyticsEntry) => {
			if (entry.userAgent) {
				let browserName = "Unknown";
				if (entry.userAgent.includes("Chrome")) {
					browserName = "Chrome";
				} else if (entry.userAgent.includes("Firefox")) {
					browserName = "Firefox";
				} else if (
					entry.userAgent.includes("Safari") &&
					!entry.userAgent.includes("Chrome")
				) {
					browserName = "Safari";
				} else if (entry.userAgent.includes("Edge")) {
					browserName = "Edge";
				} else if (
					entry.userAgent.includes("MSIE") ||
					entry.userAgent.includes("Trident/")
				) {
					browserName = "Internet Explorer";
				}

				browserCounts[browserName] = (browserCounts[browserName] || 0) + 1;
			}
		});

		const browsers = Object.entries(browserCounts).map(([name, count]) => ({
			name,
			count,
		}));

		return {
			shortCode: data.url.shortCode,
			originalUrl: data.url.originalUrl,
			totalClicks: data.totalClicks,

			referrers: data.referrerStats.map((stat: ApiReferrerStat) => ({
				source: stat.referrer || "Direct",
				count: parseInt(stat.count, 10),
			})),

			browsers,

			locations: data.countryStats.map((stat: ApiCountryStat) => ({
				country: stat.country || "Unknown",
				count: parseInt(stat.count, 10),
			})),

			clicksOverTime: data.clicksByDay.map((day: ApiClickByDay) => ({
				date: day.date,
				count: parseInt(day.count, 10),
			})),
		};
	},
};
