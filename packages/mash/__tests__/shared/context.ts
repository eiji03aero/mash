import { FileSystem } from 'mash-filesystem';
import { text } from 'mash-common';

import { Environment } from '../../src/Environment';

export const hasMockEnvironment = () => {
  const fs = FileSystem.bootstrap();
  const env = Environment.bootstrap(fs);
  const onWriteMock = jest.fn((_: text.Row) => {});
  env.onWrite(onWriteMock);
  return {
    fs,
    env,
    onWriteMock
  };
};
