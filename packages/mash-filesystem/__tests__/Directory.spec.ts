import { sharedContext } from "./shared";
import { Directory } from "../src/Directory";

describe("Directory", () => {
  it("should have basic properties", () => {
    const params = {
      id: "hoge",
      name: "directory",
      parentNodeId: "parent",
      createdAt: "0",
      updatedAt: "1",
    };

    const directory = new Directory(params);

    expect(directory.id).toEqual(params.id);
    expect(directory.name).toEqual(params.name);
    expect(directory.createdAt).toEqual(params.createdAt);
    expect(directory.updatedAt).toEqual(params.updatedAt);
  });

  it("should add and remove node from children", () => {
    const directory = sharedContext.hasDirectory();
    const directory2 = sharedContext.hasDirectory();

    directory.addChild(directory2.id);

    expect(directory.children.length).toEqual(1);
    expect(directory.children.includes(directory2.id)).toBeTruthy();

    directory.removeChild(directory2.id);

    expect(directory.children.length).toEqual(0);
  });
});
