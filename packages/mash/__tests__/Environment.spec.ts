import { IEnvironment, ExitStatus } from "../src/types";
import { Environment } from "../src/Environment";

describe("Environment", () => {
  let onWritelnMock: jest.Mock;
  let env: IEnvironment;

  beforeEach(() => {
    onWritelnMock = jest.fn((_: string) => {});
    env = new Environment({
      onWriteln: onWritelnMock,
    });
  });

  it("works", () => {
    env.exitStatus;
  });

  describe("#writeln", () => {
    it("works", () => {
      const str = "cd yade";
      env.writeln(str);
      expect(onWritelnMock).toBeCalledWith(str);
    });
  });

  describe("#reset", () => {
    it("works", () => {
      env.reset();
      expect(env.exitStatus).toEqual(ExitStatus.Success);
    });
  });

  describe("#error", () => {
    it("works", () => {
      const errCode = ExitStatus.Failure;
      const errMsg = "error desu";
      env.error(errCode, errMsg);
      expect(onWritelnMock).toBeCalledWith(`mash ${errMsg}`);
      expect(env.exitStatus).toEqual(errCode);
    });
  });
});
