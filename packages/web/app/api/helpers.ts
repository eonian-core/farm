import { HttpLink } from "@apollo/client";

export const getHttpLink = () =>
  new HttpLink({
    uri: process.env.GRAPH_URL || "http://localhost:4000/",
  });
