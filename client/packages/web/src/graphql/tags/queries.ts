import { gql } from "@apollo/client";

export const Todos = gql`
  query Todos {
    todos {
      id
      text
    }
  }
`;
