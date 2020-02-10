import { IFileSystemNode } from "mash-filesystem";
import { Monad } from "mash-common";
import { sharedContext, sharedTest } from "../shared";

describe("builtins.ls", () => {
  it("should print the children of current directory", () => {
    const { env, fs, onWriteMock } = sharedContext.hasMockEnvironment();
    const r = fs.getNodes(fs.currentDirectory.children);
    if (Monad.either.isLeft(r)) throw r.error;
    const childrenText = r.value
      .map((c: IFileSystemNode) => c.name)
      .join(" ");
    env.eval("ls");
    expect(onWriteMock).toHaveBeenCalledWith(childrenText);
  });

  it("should print the name of file", () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    const fileName = "todo.txt";
    env.eval(`ls ${fileName}`);
    expect(onWriteMock).toHaveBeenCalledWith(fileName);
  });

  it("should exit when path is invlid", () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval("ls ./hoge_not_exist");
    sharedTest.expectExitFail(env);
  });
});
