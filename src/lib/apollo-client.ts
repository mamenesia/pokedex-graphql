import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

// Pokemon GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "https://beta.pokeapi.co/graphql/v1beta",
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // Enable dev tools in development
  connectToDevTools: process.env.NODE_ENV === "development",
});

export default client;
