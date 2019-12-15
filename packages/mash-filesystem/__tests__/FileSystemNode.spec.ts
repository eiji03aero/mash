import { FileSystemNode } from "../src/FileSystemNode";
import { Directory } from "../src/Directory";

describe("FileSystemNode", () => {
  it("should have basic property defined", () => {
    const node = new FileSystemNode({ name: "test" });

    expect(node.name).toEqual("test");
    expect(node.cid).toBeDefined();
    expect(node.createdAt).toBeDefined();
  });

  it("should be able to hold parent node", () => {
    const node = new FileSystemNode({ name: "test" });
    const parentNode = new Directory({ name: "parentNode" });
    node.parentNode = parentNode;

    expect(node.parentNode).toBe(parentNode);
  });

  it("should be able to hold parent node", () => {
    const node = new FileSystemNode({ name: "test" });

    expect(() => node.parentNode).toThrow();
  });
});
