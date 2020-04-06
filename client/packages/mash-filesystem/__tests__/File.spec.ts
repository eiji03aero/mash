import { File } from "../src/File";

describe("File", () => {
  it("should have basic properties", () => {
    const params = {
      id: "hoge",
      name: "domo",
      parentNodeId: "hoge",
      content: "content desu",
      createdAt: "0",
      updatedAt: "1",
    };
    const file = new File(params);

    expect(file.id).toEqual(params.id);
    expect(file.name).toEqual(params.name);
    expect(file.content).toEqual(params.content);
    expect(file.createdAt).toEqual(params.createdAt);
    expect(file.updatedAt).toEqual(params.updatedAt);
  });
});
