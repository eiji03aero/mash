import { ExitStatus, IEnvironment } from '../../src/types';

export const expectExitFail = (env: IEnvironment) => {
  expect(env.exitStatus).toEqual(ExitStatus.Failure);
};
