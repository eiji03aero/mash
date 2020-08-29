import { ExitStatus, IEnvironment } from "../../src/types";

export const expectExitFail = (env: IEnvironment): void => {
  expect(env.exitStatus).toEqual(ExitStatus.Failure);
};
