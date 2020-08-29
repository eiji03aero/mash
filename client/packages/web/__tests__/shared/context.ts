import { Environment, IEnvironment } from "mash";
import { FileSystem, IFileSystem } from "mash-filesystem";
import { installFixtureNodes } from "mash-filesystem/lib/bin/installFixtureNodes";

type MockEnvironment = {
  fs: IFileSystem;
  env: IEnvironment;
  onWriteMock: (_: string) => void;
}

export const hasMockEnvironment = (): MockEnvironment => {
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
