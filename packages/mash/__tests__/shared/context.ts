import { FileSystem } from "mash-filesystem";

import { Environment } from "../../src/Environment";

export const hasMockEnvironment = () => {
  const fs = FileSystem.bootstrap();
  const env = Environment.bootstrap(fs);
  const onWriteMock = jest.fn((_: string) => {});
  env.onWrite(onWriteMock);
  return {
    fs,
    env,
    onWriteMock,
  };
};
