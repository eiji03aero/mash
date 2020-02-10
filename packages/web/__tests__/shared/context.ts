import { FileSystem } from "mash-filesystem";
import { installFixtureNodes } from "mash-filesystem/lib/bin/installFixtureNodes";

import { Environment } from "../../src/Environment";

export const hasMockEnvironment = () => {
  const fs = FileSystem.bootstrap();
  installFixtureNodes(fs);

  const env = Environment.bootstrap(fs);

  const onWriteMock = jest.fn((_: string) => {});
  env.onWrite(onWriteMock);

  return {
    fs,
    env,
    onWriteMock,
  };
};
