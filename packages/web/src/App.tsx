import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

interface IProps {
  domo?: string;
}

const GET_DATA = gql`
  query GetData {
    domo @client
  }
`;

export const App: React.SFC<IProps> = ({

}) => {
  const {
    data,
    loading,
  } = useQuery(GET_DATA);

  return (
    <div>
      { loading && (
        <h2>hoge yade</h2>
      )}
      <h1>
        domo {data.domo}
      </h1>
    </div>
  );
};
