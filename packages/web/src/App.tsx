import React from "react";
import { useQuery, useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";

interface IProps {
  domo?: string;
}

const GET_DATA = gql`
  query GetData {
    domo @client
  }
`;

const SUBSCRIPTION = gql`
  subscription helloDesu {
    hello
  }
`;

export const App: React.SFC<IProps> = ({

}) => {
  const [messages, setMessages] = React.useState<string[]>([]);

  const {
    data,
    loading,
  } = useQuery(GET_DATA);

  useSubscription(SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }: any) => {
      const { data: { hello } } = subscriptionData;
      const str = new Date().toISOString() + ": domo " + hello;
      setMessages(messages.concat(str));
    }
  });

  return (
    <div>
      { loading && (
        <h2>hoge yade</h2>
      )}
      <h1>
        domo {data.domo}
      </h1>
      { messages.map((m: any) => {
        return <p key={m}>{ m }</p>;
      })}
    </div>
  );
};
