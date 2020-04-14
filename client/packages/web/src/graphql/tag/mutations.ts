import gql from "graphql-tag";

export const CreateTodo = gql`
  mutation CreateTodo($input: NewTodo!) {
    createTodo(input: $input) {
      id
      text
    }
  }
`;

export const Signup = gql`
  mutation Signup($input: Signup!) {
    signup(input: $input) {
      id
      name
    }
  }
`;
