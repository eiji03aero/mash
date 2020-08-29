import { Environment } from "../../src/Environment";
import { IEnvironment } from "../../src/types";

export const hasMockEnvironment = (): {env:IEnvironment, onWriteMock: (_: string) => void} => {
  const onWriteMock = jest.fn((_: string) => {});

  const env = new Environment({
    onWriteln: onWriteMock,
  });

  return {
    env,
    onWriteMock,
  };
};
