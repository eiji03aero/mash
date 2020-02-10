import { sharedContext, sharedTest } from "../shared";

describe("builtins.dirname", () => {
  it("should print directory path", () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    env.eval("dirname /home/app");
    expect(onWriteMock).toBeCalledWith("/home");
  });

  it("should print dot when passed invalid path", () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    env.eval("dirname hogehoge");
    expect(onWriteMock).toBeCalledWith(".");
  });

  it("should exit error when argument not enough", () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval("dirname");
    sharedTest.expectExitFail(env);
  });
});
