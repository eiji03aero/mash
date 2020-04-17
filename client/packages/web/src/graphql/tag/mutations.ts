import gql from "graphql-tag";

export const CreateTodo = gql`
  mutation CreateTodo($input: INewTodo!) {
    createTodo(input: $input) {
      id
      text
    }
  }
`;

export const Signup = gql`
  mutation Signup($input: ISignup!) {
    signup(input: $input) {
      user {
        id
        name
      }
    }
  }
`;

export const Login = gql`
  mutation Login($input: ILogin!) {
    login(input: $input) {
      token
    }
  }
`;
