import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { urlService } from "@/services/urlService";
import { isValidUrl } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";

interface ShortenUrlFormProps {
	onSuccess?: () => void;
}

export const ShortenUrlForm = ({ onSuccess }: ShortenUrlFormProps) => {
	const [url, setUrl] = useState("");
	const [customAlias, setCustomAlias] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { mutate: onShortenUrl, isPending: isSaving } = useMutation({
		mutationFn: urlService.shortenUrl,
		onSuccess: () => {
			toast.success("Url shorten successfully");
			setUrl("");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create user");
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isValidUrl(url)) {
			toast.error("Please enter a valid URL");
			return;
		}

		setIsSubmitting(true);

		try {
			await urlService.shortenUrl({
				originalUrl: url,
				customAlias: customAlias.trim() || undefined,
			});

			toast.success("URL shortened successfully!");
			setUrl("");
			setCustomAlias("");

			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			const errorMsg = error.message || "Failed to shorten URL";
			toast.error(errorMsg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Shorten a URL</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="url" className="text-sm font-medium block mb-1">
							URL to shorten
						</label>
						<Input
							id="url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="https://example.com/my-long-url"
							required
						/>
					</div>

					<Button type="submit" className="w-2/5" disabled={isSubmitting}>
						{isSubmitting ? "Shortening..." : "Shorten URL"}
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};
