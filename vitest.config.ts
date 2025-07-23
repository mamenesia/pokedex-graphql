/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// Test environment
		environment: "jsdom",

		// Setup files
		setupFiles: ["./vitest.setup.ts"],

		// Global test settings
		globals: true,

		// Test file patterns
		include: ["src/**/*.{test,spec,vitest}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

		// Coverage settings
		coverage: {
			provider: "v8",
			reporter: ["text", "json", "html"],
			exclude: [
				"node_modules/",
				"src/test/",
				"**/*.d.ts",
				"**/*.config.*",
				"**/coverage/**",
			],
		},

		// Watch settings
		watch: false,
	},

	// Path resolution (for @/ imports)
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
