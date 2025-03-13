import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { LoginRequest } from "@/types/auth";
import { Link } from "react-router-dom";

export const LoginForm = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, handleGoogleAuth } = useAuth();

	const { mutate: loginMutation, isPending } = useMutation({
		mutationFn: (credentials: LoginRequest) =>
			login(credentials.email, credentials.password),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		loginMutation({ email, password });
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center pt-16 px-4">
			<Link to="/" className="text-3xl font-bold mb-12">URL Shortener</Link>
			
			<Card className="w-full max-w-md p-8">
				<div className="space-y-2 text-center mb-6">
					<h2 className="text-2xl font-semibold">Log in to your account</h2>
					<p className="text-sm text-gray-500">
						<Link to="/register" className="text-blue-600 hover:underline">Sign up</Link>
						{" "}if you don't have an account
					</p>
				</div>

				<Button 
					variant="outline" 
					onClick={() => handleGoogleAuth("login")}
					className="w-full mb-6"
				>
					Continue with Google
				</Button>

				<div className="relative mb-6">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white px-2 text-gray-500">Or</span>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<Input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? "Signing in..." : "Sign in"}
					</Button>
				</form>
			</Card>
		</div>
	);
};
