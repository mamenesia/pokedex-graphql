import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			new URL("https://beta.pokeapi.co/graphql/v1beta/**"),
			new URL("https://raw.githubusercontent.com/**"),
		],
	},
	output: "standalone",
};

export default nextConfig;
