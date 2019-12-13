import { Directory } from "../src/Directory";
import { File } from "../src/File";

describe("Directory", () => {
  it("should have basic properties", () => {
    const directory = new Directory({ name: "directory" });

    expect(directory.name).toEqual("directory");
    expect(directory.children).toBeDefined();
    expect(directory.cid).toBeDefined();
    expect(directory.createdAt).toBeDefined();
  });

  it("should add node to children", () => {
    const directory = new Directory({ name: "directory" });
    const node = new File({ name: "file" });

    directory.addChild(node);

    expect(directory.children.length).toEqual(1);
    expect(directory.children[0]).toBe(node);
  });

  it("should remove node from children", () => {
    const directory = new Directory({ name: "directory" });
    const node = new File({ name: "file" });

    directory.addChild(node);

    expect(directory.children.length).toEqual(1);

    directory.removeChild(node);

    expect(directory.children.length).toEqual(0);
  });
});
