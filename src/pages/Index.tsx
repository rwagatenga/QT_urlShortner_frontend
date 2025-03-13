import { useState } from "react";
import { Link as LinkIcon, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isValidUrl } from "@/lib/utils";
import { Header } from "@/components/layout/Header";

const Index = () => {
	const [url, setUrl] = useState("");
	const navigate = useNavigate();

	const handleShortenUrl = (e: React.FormEvent) => {
		e.preventDefault();

		if (!isValidUrl(url)) {
			toast.error("Please enter a valid URL");
			return;
		}

		sessionStorage.setItem("pendingUrl", url);
		toast.success("URL ready! Please sign up or log in to continue");
		navigate("/register");
	};

	return (
		<div className="min-h-screen bg-[#001B3D]">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
				<div className="text-center mb-8 md:mb-12">
					<h1 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">
						Build stronger digital connections
					</h1>
					<p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto">
						Use our URL shortener, QR Codes, and landing pages to engage your
						audience and connect them to the right information.
					</p>
				</div>

				<div className="flex justify-center gap-2 md:gap-4 mb-8 md:mb-12">
					<Button variant="outline" className="bg-white text-xs md:text-sm">
						<LinkIcon className="h-4 w-4 mr-1 md:mr-2" />
						Short link
					</Button>
					<Button variant="outline" className="bg-white text-xs md:text-sm">
						<QrCode className="h-4 w-4 mr-1 md:mr-2" />
						QR Code
					</Button>
				</div>

				<div className="max-w-sm md:max-w-2xl mx-auto bg-white rounded-xl md:rounded-2xl p-4 md:p-8">
					<h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2">
						Shorten a long link
					</h2>
					<p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
						No credit card required.
					</p>

					<form onSubmit={handleShortenUrl} className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-2 block">
								Paste your long link here
							</label>
							<Input
								type="url"
								placeholder="https://example.com/my-long-url"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
								className="w-full"
								required
							/>
						</div>
						<Button type="submit" className="w-full" size="lg">
							Get your link for free
						</Button>
					</form>
				</div>
			</main>
		</div>
	);
};

export default Index;
