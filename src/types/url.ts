export interface UrlInterface {
	id: string;
	userId: string;
	shortCode: string;
	originalUrl: string;
	shortUrl: string;
	clicks: number;
	createdAt: string;
	expiresAt?: string | null;
	customAlias?: string | null;
}

export interface UrlAnalytics {
	shortCode: string;
	originalUrl: string;
	totalClicks: number;
	referrers: Array<{ source: string; count: number }>;
	browsers: Array<{ name: string; count: number }>;
	locations: Array<{ country: string; count: number }>;
	clicksOverTime: Array<{ date: string; count: number }>;
}

export interface ShortenUrlRequest {
	originalUrl: string;
	customAlias?: string;
	expiresAt?: string;
}

export interface UrlsResponse {
	urls: UrlInterface[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

export interface UserUrlAnalytics {
	id: string;
	urlId: string;
	referrer?: string | null;
	userAgent?: string | null;
	ipAddress?: string | null;
	country?: string | null;
	city?: string | null;
	clickedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
}

export interface UserUrl {
	id: string;
	userId: string;
	shortCode: string;
	originalUrl: string;
	clicks: number;
	analytics: UserUrlAnalytics[];
}

export interface ApiUrlData {
	id: string;
	userId: string;
	shortCode: string;
	originalUrl: string;
	clicks: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface ApiAnalyticsEntry {
	id: string;
	urlId: string;
	referrer: string | null;
	userAgent: string;
	ipAddress: string;
	country: string | null;
	city: string | null;
	clickedAt: string;
	createdAt: string;
	updatedAt: string;
	deletedAt: string | null;
}

export interface ApiReferrerStat {
	referrer: string | null;
	count: string;
}

export interface ApiCountryStat {
	country: string | null;
	count: string;
}

export interface ApiClickByDay {
	date: string;
	count: string;
}

export interface ApiAnalyticsResponse {
	success: boolean;
	data: {
		url: ApiUrlData;
		totalClicks: number;
		analytics: ApiAnalyticsEntry[];
		referrerStats: ApiReferrerStat[];
		countryStats: ApiCountryStat[];
		clicksByDay: ApiClickByDay[];
	};
	source: string;
}
