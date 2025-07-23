import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ApolloProviderWrapper } from "@/components/providers/apollo-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Pokedex GraphQL",
	description: "A comprehensive Pokedex built with Next.js and GraphQL",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn("text-base antialiased", inter.className)}>
				<ApolloProviderWrapper>{children}</ApolloProviderWrapper>
			</body>
		</html>
	);
}
