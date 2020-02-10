import { sharedContext, sharedTest } from "../shared";

describe("builtins.touch", () => {
  it("should create file in same directory", () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const fileName = "hoge";
    const size = fs.currentDirectory.children.length;

    env.eval(`touch ${fileName}`);
    expect(fs.currentDirectory.children.length).toEqual(size + 1);
  });

  it("should exit error when passed invalid path", () => {
    const { env } = sharedContext.hasMockEnvironment();
    const path = "../hoge_na_directory/domo";
    env.eval(`touch ${path}`);
    sharedTest.expectExitFail(env);
  });

  it("should return/exitStatus error when argument is not enough", () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval("touch");
    sharedTest.expectExitFail(env);
  });
});
