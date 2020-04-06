import * as utils from "../src/utils";
import { Directory } from "../src/Directory";
import { File } from "../src/File";

const testFileProperties = {
  id: "dir",
  name: "dir",
  parentNodeId: "hoge",
  content: "",
  createdAt: "0",
  updatedAt: "1",
};

const testDirectoryProperties = {
  id: "dir",
  name: "dir",
  parentNodeId: "hoge",
  children: [],
  createdAt: "0",
  updatedAt: "1",
};

describe("utils", () => {
  describe("isDirectory", () => {
    it("should tell if it is instance of Directory", () => {
      const dir = new Directory(testDirectoryProperties);
      const result = utils.isDirectory(dir);
      expect(result).toBeTruthy();
    });
  });

  describe("isFile", () => {
    it("should tell if it is instance of File", () => {
      const file = new File(testFileProperties);
      const result = utils.isFile(file);
      expect(result).toBeTruthy();
    });
  });

  describe("parsePath", () => {
    it("works", () => {
      const tests = [
        {
          path: "/dir/file",
          expected: {
            isAbsolutePath: true,
            fragments: ["dir", "file"],
          },
        },
        {
          path: "./dir/file",
          expected: {
            isAbsolutePath: false,
            fragments: [".", "dir", "file"],
          },
        },
        {
          path: "../dir/file",
          expected: {
            isAbsolutePath: false,
            fragments: ["..", "dir", "file"],
          },
        },
      ];

      for (const t of tests) {
        const result = utils.parsePath(t.path);
        expect(result).toEqual(t.expected);
      }
    });
  });
});
