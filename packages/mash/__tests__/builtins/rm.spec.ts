import { sharedContext, sharedTest } from "../shared";

describe("builtins.rm", () => {
  it("should delete file", () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const fileName = "hoge.txt";
    const size = fs.currentDirectory.children.length;

    fs.createFile({ parentNodeId: fs.currentDirectory.id, params: { name: fileName }});
    env.eval(`rm ${fileName}`);
    expect(fs.currentDirectory.children.length).toEqual(size);
  });

  it("should delete directory", () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const dirName = "hoge";
    const size = fs.currentDirectory.children.length;

    fs.createDirectory({ parentNodeId: fs.currentDirectory.id, params: { name: dirName }});
    env.eval(`rm ${dirName} -r`);
    expect(fs.currentDirectory.children.length).toEqual(size);
  });

  it("should exit when argument is not enough", () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval("rm");
    sharedTest.expectExitFail(env);
  });

  it("should exit when target is directory but no -r option", () => {
    const { env, fs } = sharedContext.hasMockEnvironment();
    const dirName = "hoge";
    fs.createDirectory({parentNodeId: fs.currentDirectory.id, params: { name: dirName }});
    env.eval(`rm ${dirName}`);
    sharedTest.expectExitFail(env);
  });
});
