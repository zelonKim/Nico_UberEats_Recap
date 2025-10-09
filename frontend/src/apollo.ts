import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from "@apollo/client";
import { LOCAL_STORAGE_TOKEN } from "./constants";
import { setContext } from "@apollo/client/link/context";

const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);

export const isLoggedInVar = makeVar(Boolean(token)); // makeVar(초기값)을 통해 반응형 변수 (reactive variables)를 생성함.
export const authTokenVar = makeVar(token);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  console.log(headers);
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVar() || "",
    },
  };
});

// console.log("default value of isLoggedInVar is:", isLoggedInVar());
// console.log("default value of isLoggedInVar is:", authTokenVar());

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          token: {
            read() {
              return authTokenVar();
            },
          },
        },
      },
    },
  }),
});
