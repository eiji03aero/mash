import gql from "graphql-tag";

export const CreateTodo = gql`
  mutation CreateTodo($input: NewTodo!) {
    createTodo(input: $input) {
      id
      text
    }
  }
`;
