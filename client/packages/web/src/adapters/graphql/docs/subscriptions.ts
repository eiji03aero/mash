import gql from "graphql-tag";

export const TodoAdded = gql`
  subscription TodoAdded($userId: String!) {
    todoAdded(userId: $userId) {
      id
      text
    }
  }
`;
