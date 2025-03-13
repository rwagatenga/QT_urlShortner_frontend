import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Header = () => {
	const { user, logout } = useAuth();

	return (
		<header className="border-b border-gray-200/10 bg-[#001B3D]">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
				<div className="text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-0">
					URL Shortener
				</div>
				<div className="flex items-center space-x-2 sm:space-x-4">
					{user ? (
						<>
							<div className="text-white mr-2 hidden sm:block">
								Welcome, {user.firstName}
							</div>
							<Button
								variant="outline"
								size="sm"
								className="text-white hover:text-gray-100 bg-red-500 hover:bg-red-600"
								onClick={logout}
							>
								<LogOut className="h-4 w-4 mr-2" />
								Logout
							</Button>
						</>
					) : (
						<>
							<Link
								to="/login"
								className="text-white hover:text-gray-300 text-sm sm:text-base"
							>
								Log in
							</Link>
							<Link to="/register">
								<Button size="sm" className="whitespace-nowrap">
									Sign up Free
								</Button>
							</Link>
						</>
					)}
				</div>
			</nav>
		</header>
	);
};
