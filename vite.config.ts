import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
	define: {
		"process.env.VITE_BACKEND_URL": JSON.stringify(
			process.env.VITE_BACKEND_URL,
		),
	},
	server: {
		host: "::",
		port: 8080,
		cors: {
			// the origin you will be accessing via browser
			origin: process.env.VITE_BACKEND_URL,
		},
	},
	plugins: [react(), mode === "development" && componentTagger()].filter(
		Boolean,
	),
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
}));
