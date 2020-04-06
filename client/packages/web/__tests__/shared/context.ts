import { Environment } from "mash";
import { FileSystem } from "mash-filesystem";
import { installFixtureNodes } from "mash-filesystem/lib/bin/installFixtureNodes";

export const hasMockEnvironment = () => {
  const fs = FileSystem.bootstrap();
  installFixtureNodes(fs);

  const onWriteMock = jest.fn((_: string) => {})
  const env = new Environment({
    onWriteln: onWriteMock,
  });

  return {
    fs,
    env,
    onWriteMock,
  };
};
