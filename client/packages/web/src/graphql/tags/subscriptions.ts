import { gql } from "@apollo/client";

export const TodoAdded = gql`
  subscription TodoAdded($userId: String!) {
    todoAdded(userId: $userId) {
      id
      text
    }
  }
`;
