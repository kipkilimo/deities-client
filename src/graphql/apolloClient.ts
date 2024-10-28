import { ApolloClient, InMemoryCache } from "@apollo/client";
const apiUrl = import.meta.env.VITE_BASE_URL;

const client = new ApolloClient({
  uri: `${apiUrl}/graphql`, // "http://localhost:4000/graphql", // "https://nem.bio:4000/graphql", // Replace with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export { client };
