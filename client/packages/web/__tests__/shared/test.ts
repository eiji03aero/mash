import { ExitStatus, IEnvironment } from "mash";

export const expectExitFail = (env: IEnvironment) => {
  expect(env.exitStatus).toEqual(ExitStatus.Failure);
};
