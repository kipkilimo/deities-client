import { ApolloClient, InMemoryCache } from "@apollo/client";
const apiUrl = import.meta.env.VITE_BASE_URL;

const client = new ApolloClient({
  uri: `${apiUrl}/graphql`,
  cache: new InMemoryCache(),
});

export { client };
