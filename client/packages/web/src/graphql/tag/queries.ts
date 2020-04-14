import gql from "graphql-tag";

export const Todos = gql`
  query Todos {
    todos {
      id
      text
    }
  }
`;
