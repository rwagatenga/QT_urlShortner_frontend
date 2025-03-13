import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { userService } from "@/services/userService";
import { UpdateUserRequest } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const ProfileManager = () => {
	const { user, logout } = useAuth();
	const [formData, setFormData] = useState<UpdateUserRequest>({
		firstName: "",
		lastName: "",
		email: "",
	});
	const [newPassword, setNewPassword] = useState("");

	useEffect(() => {
		if (user) {
			setFormData({
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
			});
		}
	}, [user]);

	const { mutate: updateProfileMutation, isPending: isUpdating } = useMutation({
		mutationFn: (data: UpdateUserRequest) =>
			userService.updateUserProfile(user?.id || "", data),
		onSuccess: () => {
			toast.success("Profile updated successfully!");
		},
		onError: (error) => {
			console.log(error.message);
			toast.error(error.message || "Failed to update profile");
		},
	});

	const { mutate: deleteAccountMutation, isPending: isDeleting } = useMutation({
		mutationFn: () => userService.deleteUser(user?.id || ""),
		onSuccess: () => {
			toast.success("Account deleted successfully");
			logout();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete account");
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const payload = { ...formData };
		if (newPassword) {
			payload.password = newPassword;
		}
		updateProfileMutation(payload);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleDeleteAccount = () => {
		deleteAccountMutation();
	};

	if (!user) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Profile Settings</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-sm font-medium">First Name</label>
							<Input
								name="firstName"
								value={formData.firstName || ""}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium">Last Name</label>
							<Input
								name="lastName"
								value={formData.lastName || ""}
								onChange={handleChange}
								required
							/>
						</div>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Email</label>
						<Input
							type="email"
							name="email"
							value={formData.email || ""}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">
							New Password (leave blank to keep current)
						</label>
						<Input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder="Enter new password"
						/>
					</div>
					<div className="flex justify-between">
						<Button type="submit" disabled={isUpdating}>
							{isUpdating ? "Saving..." : "Save Changes"}
						</Button>

						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" disabled={isDeleting}>
									Delete Account
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
									<AlertDialogDescription>
										This action cannot be undone. This will permanently delete
										your account and all your data including shortened URLs.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction
										onClick={handleDeleteAccount}
										className="bg-red-600 hover:bg-red-700"
									>
										{isDeleting ? "Deleting..." : "Delete Account"}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
