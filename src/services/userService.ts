import { apiClient } from "@/lib/api-client";
import { User, UpdateUserRequest } from "@/types/auth";

export const userService = {
	getUserProfile: async (): Promise<User> => {
		const response = await apiClient.get("/auth/profile");
		return response.data;
	},

	updateUserProfile: async (
		userId: string,
		userData: UpdateUserRequest,
	): Promise<User> => {
		const response = await apiClient.put(`/auth/user/${userId}`, userData);
		return response.data;
	},

	deleteUser: async (userId: string): Promise<{ message: string }> => {
		const response = await apiClient.delete(`/auth/user/${userId}`);
		return response.data;
	},
};
