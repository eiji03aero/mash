import { Environment } from "../../src/Environment";

export const hasMockEnvironment = () => {
  const onWriteMock = jest.fn((_: string) => {});

  const env = new Environment({
    onWriteln: onWriteMock,
  });

  return {
    env,
    onWriteMock,
  };
};
