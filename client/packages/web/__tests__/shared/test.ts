import { ExitStatus, IEnvironment } from "mash";

export const expectExitFail = (env: IEnvironment): void => {
  expect(env.exitStatus).toEqual(ExitStatus.Failure);
};
