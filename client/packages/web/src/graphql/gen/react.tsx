import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  token: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createTodo: Todo;
  signup: RSignup;
  login: RLogin;
  logout?: Maybe<RNone>;
};


export type MutationCreateTodoArgs = {
  input: INewTodo;
};


export type MutationSignupArgs = {
  input: ISignup;
};


export type MutationLoginArgs = {
  input: ILogin;
};

export type INewTodo = {
  text: Scalars['String'];
  userId: Scalars['String'];
};

export type INone = {
  none?: Maybe<Scalars['Boolean']>;
};

export type RLogin = {
  __typename?: 'RLogin';
  token: Scalars['String'];
};

export type Todo = {
  __typename?: 'Todo';
  id: Scalars['ID'];
  text: Scalars['String'];
  done: Scalars['Boolean'];
  user: User;
};

export type ISignup = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type RSignup = {
  __typename?: 'RSignup';
  user: User;
};

export type RNone = {
  __typename?: 'RNone';
  none?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  localState: LocalState;
  users: Array<User>;
};

export type Subscription = {
  __typename?: 'Subscription';
  todoAdded: Todo;
};


export type SubscriptionTodoAddedArgs = {
  userId: Scalars['String'];
};

export type ILogin = {
  name: Scalars['String'];
  password: Scalars['String'];
};

export type LocalState = {
  __typename?: 'LocalState';
  username: Scalars['String'];
  applicationState: ApplicationState;
  editorState: EditorState;
};

export enum ApplicationState {
  Stopped = 'Stopped',
  Booting = 'Booting',
  Running = 'Running'
}

export enum EditorState {
  Stopped = 'Stopped',
  Running = 'Running'
}

export type CreateTodoMutationVariables = Exact<{
  input: INewTodo;
}>;


export type CreateTodoMutation = (
  { __typename?: 'Mutation' }
  & { createTodo: (
    { __typename?: 'Todo' }
    & Pick<Todo, 'id' | 'text'>
  ) }
);

export type SignupMutationVariables = Exact<{
  input: ISignup;
}>;


export type SignupMutation = (
  { __typename?: 'Mutation' }
  & { signup: (
    { __typename?: 'RSignup' }
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'name'>
    ) }
  ) }
);

export type LoginMutationVariables = Exact<{
  input: ILogin;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'RLogin' }
    & Pick<RLogin, 'token'>
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & { logout?: Maybe<(
    { __typename?: 'RNone' }
    & Pick<RNone, 'none'>
  )> }
);

export type TodoAddedSubscriptionVariables = Exact<{
  userId: Scalars['String'];
}>;


export type TodoAddedSubscription = (
  { __typename?: 'Subscription' }
  & { todoAdded: (
    { __typename?: 'Todo' }
    & Pick<Todo, 'id' | 'text'>
  ) }
);

export type GetLocalStateQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocalStateQuery = (
  { __typename?: 'Query' }
  & { localState: (
    { __typename?: 'LocalState' }
    & Pick<LocalState, 'username' | 'applicationState' | 'editorState'>
  ) }
);


export const CreateTodoDocument = gql`
    mutation CreateTodo($input: INewTodo!) {
  createTodo(input: $input) {
    id
    text
  }
}
    `;
export type CreateTodoMutationFn = ApolloReactCommon.MutationFunction<CreateTodoMutation, CreateTodoMutationVariables>;

/**
 * __useCreateTodoMutation__
 *
 * To run a mutation, you first call `useCreateTodoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTodoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTodoMutation, { data, loading, error }] = useCreateTodoMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTodoMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateTodoMutation, CreateTodoMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(CreateTodoDocument, baseOptions);
      }
export type CreateTodoMutationHookResult = ReturnType<typeof useCreateTodoMutation>;
export type CreateTodoMutationResult = ApolloReactCommon.MutationResult<CreateTodoMutation>;
export type CreateTodoMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateTodoMutation, CreateTodoMutationVariables>;
export const SignupDocument = gql`
    mutation Signup($input: ISignup!) {
  signup(input: $input) {
    user {
      id
      name
    }
  }
}
    `;
export type SignupMutationFn = ApolloReactCommon.MutationFunction<SignupMutation, SignupMutationVariables>;

/**
 * __useSignupMutation__
 *
 * To run a mutation, you first call `useSignupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSignupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [signupMutation, { data, loading, error }] = useSignupMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSignupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SignupMutation, SignupMutationVariables>) {
        return ApolloReactHooks.useMutation<SignupMutation, SignupMutationVariables>(SignupDocument, baseOptions);
      }
export type SignupMutationHookResult = ReturnType<typeof useSignupMutation>;
export type SignupMutationResult = ApolloReactCommon.MutationResult<SignupMutation>;
export type SignupMutationOptions = ApolloReactCommon.BaseMutationOptions<SignupMutation, SignupMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: ILogin!) {
  login(input: $input) {
    token
  }
}
    `;
export type LoginMutationFn = ApolloReactCommon.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return ApolloReactHooks.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = ApolloReactCommon.MutationResult<LoginMutation>;
export type LoginMutationOptions = ApolloReactCommon.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    none
  }
}
    `;
export type LogoutMutationFn = ApolloReactCommon.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return ApolloReactHooks.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = ApolloReactCommon.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = ApolloReactCommon.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const TodoAddedDocument = gql`
    subscription TodoAdded($userId: String!) {
  todoAdded(userId: $userId) {
    id
    text
  }
}
    `;

/**
 * __useTodoAddedSubscription__
 *
 * To run a query within a React component, call `useTodoAddedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTodoAddedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTodoAddedSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useTodoAddedSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<TodoAddedSubscription, TodoAddedSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<TodoAddedSubscription, TodoAddedSubscriptionVariables>(TodoAddedDocument, baseOptions);
      }
export type TodoAddedSubscriptionHookResult = ReturnType<typeof useTodoAddedSubscription>;
export type TodoAddedSubscriptionResult = ApolloReactCommon.SubscriptionResult<TodoAddedSubscription>;
export const GetLocalStateDocument = gql`
    query GetLocalState {
  localState @client {
    username
    applicationState
    editorState
  }
}
    `;

/**
 * __useGetLocalStateQuery__
 *
 * To run a query within a React component, call `useGetLocalStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocalStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocalStateQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLocalStateQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetLocalStateQuery, GetLocalStateQueryVariables>) {
        return ApolloReactHooks.useQuery<GetLocalStateQuery, GetLocalStateQueryVariables>(GetLocalStateDocument, baseOptions);
      }
export function useGetLocalStateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetLocalStateQuery, GetLocalStateQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetLocalStateQuery, GetLocalStateQueryVariables>(GetLocalStateDocument, baseOptions);
        }
export type GetLocalStateQueryHookResult = ReturnType<typeof useGetLocalStateQuery>;
export type GetLocalStateLazyQueryHookResult = ReturnType<typeof useGetLocalStateLazyQuery>;
export type GetLocalStateQueryResult = ApolloReactCommon.QueryResult<GetLocalStateQuery, GetLocalStateQueryVariables>;