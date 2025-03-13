import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { RegisterRequest } from "@/types/auth";
import { Link } from "react-router-dom";

export const RegisterForm = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
	});

	const { register, handleGoogleAuth } = useAuth();

	const { mutate: registerMutation, isPending } = useMutation({
		mutationFn: (data: RegisterRequest) => register({ ...data }),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		registerMutation(formData as RegisterRequest);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
			<Card className="w-full max-w-md p-8 space-y-6 backdrop-blur-xl bg-white/80 shadow-xl">
				<div className="space-y-2 text-center">
					<h2 className="text-3xl font-semibold tracking-tight">
						Create an account
					</h2>
					<p className="text-sm text-gray-500">
						Enter your information to get started
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<Input
							name="firstName"
							placeholder="First Name"
							value={formData.firstName}
							onChange={handleChange}
							className="transition-all"
							required
						/>
						<Input
							name="lastName"
							placeholder="Last Name"
							value={formData.lastName}
							onChange={handleChange}
							className="transition-all"
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<Input
							name="username"
							type="username"
							placeholder="Username"
							value={formData.username}
							onChange={handleChange}
							className="transition-all"
							required
						/>
						<Input
							name="email"
							type="email"
							placeholder="Email"
							value={formData.email}
							onChange={handleChange}
							className="transition-all"
							required
						/>
					</div>

					<Input
						name="password"
						type="password"
						placeholder="Password"
						value={formData.password}
						onChange={handleChange}
						className="transition-all"
						required
					/>

					<Button type="submit" className="w-full" disabled={isPending}>
						{isPending ? "Creating account..." : "Create account"}
					</Button>
				</form>

				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-white px-2 text-gray-500">
							Or continue with
						</span>
					</div>
				</div>

				<Button
					variant="outline"
					className="w-full"
					onClick={() => handleGoogleAuth("signup")}
				>
					Continue with Google
				</Button>

				<p className="text-center text-sm text-gray-500">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-blue-500 hover:text-blue-700 transition-colors"
					>
						Sign in
					</Link>
				</p>
			</Card>
		</div>
	);
};
