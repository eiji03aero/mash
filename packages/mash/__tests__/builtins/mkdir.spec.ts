import { sharedContext, sharedTest } from "../shared";

describe("builtins.mkdir", () => {
  it("should create directory in same directory", () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const size = fs.currentDirectory.children.length;
    const dirName = "hoge";
    env.eval(`mkdir ${dirName}`);
    expect(fs.currentDirectory.children.length).toEqual(size + 1);
  });

  it("should exit error when passed invalid path", () => {
    const { env } = sharedContext.hasMockEnvironment();
    const path = "../hoge_na_directory/domo";
    env.eval(`mkdir ${path}`);
    sharedTest.expectExitFail(env);
  });

  it("should return/exitStatus error when argument is not enough", () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval("mkdir");
    sharedTest.expectExitFail(env);
  });
});
