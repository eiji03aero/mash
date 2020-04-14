import * as E from "fp-ts/lib/Either";
import { sharedContext, installFixtureNodes } from "./shared";
import { IFileSystem, IFile, IDirectory } from "../src/types";
import { FileSystem } from "../src/FileSystem";

describe("FileSystem", () => {
  let fs: IFileSystem;
  let rootDirectory: IDirectory;
  let appDirectory: IDirectory;
  let domoFile: IFile;

  beforeEach(() => {
    fs = FileSystem.reboot();
    installFixtureNodes(fs);

    const r = fs.resolveNodeFromPath("/");
    if (E.isLeft(r)) throw r.left;
    rootDirectory = r.right as IDirectory;

    const r2 = fs.createDirectory({
      parentNodeId: fs.currentDirectory.id,
      params: sharedContext.hasDirectoryBasis({
        name: "app",
      }),
    });
    if (E.isLeft(r2)) throw r2.left;
    appDirectory = r2.right;

    const r3 = fs.createFile({
      parentNodeId: appDirectory.id,
      params: sharedContext.hasFileBasis({
        name: "domo",
        content: "hm hm",
      }),
    });
    if (E.isLeft(r3)) throw r3.left;
    domoFile = r3.right;
  });

  describe("#createFile", () => {
    it("works", () => {
      const fileParams = sharedContext.hasFileBasis();
      const r = fs.createFile({
        parentNodeId: fs.currentDirectory.id,
        params: fileParams,
      });
      expect(E.isLeft(r)).toBeFalsy();
    });
  });

  describe("#deleteFile", () => {
    it("works", () => {
      const size = fs.size;
      const r = fs.deleteFile(domoFile.id);
      if (E.isLeft(r)) throw r.left;
      expect(fs.size).toEqual(size - 1);
    });
  });

  describe("#createDirectory", () => {
    it("works", () => {
      const directoryParams = sharedContext.hasDirectoryBasis();
      const r = fs.createDirectory({
        parentNodeId: fs.currentDirectory.id,
        params: directoryParams,
      });
      expect(E.isLeft(r)).toBeFalsy();
    });
  });

  describe("#deleteDirectory", () => {
    it("works", () => {
      const size = fs.size;
      const r = fs.deleteDirectory(appDirectory.id);
      if (E.isLeft(r)) throw r.left;
      expect(fs.size).toEqual(size - 2);
    });
  });

  describe("#changeCurrentDirectory", () => {
    it("works", () => {
      const r = fs.changeCurrentDirectory(appDirectory.id);
      if (E.isLeft(r)) throw r.left;
      expect(fs.currentDirectory.name).toEqual("app");
    });

    it("returns error when path not existed passed", () => {
      const r = fs.changeCurrentDirectory("unknown id");
      expect(E.isLeft(r)).toBeTruthy();
    });
  });

  describe("#resolveNodeFromPath", () => {
    it("works", () => {
      const r = fs.resolveNodeFromPath("./app");
      if (E.isLeft(r)) throw r.left;
      expect(r.right.id).toEqual(appDirectory.id);

      const r2 = fs.resolveNodeFromPath("/");
      if (E.isLeft(r2)) throw r2.left;
      expect(r2.right.id).toEqual(rootDirectory.id);
    });
  });

  describe("#resolveAbsolutePath", () => {
    it("works", () => {
      const r = fs.resolveAbsolutePath(appDirectory.id);
      if (E.isLeft(r)) throw r.left;

      expect(r.right).toEqual("/home/app")
    });
  });

  describe("#getNodes", () => {
    it("works", () => {
      const size = appDirectory.children.length;
      const r = fs.getNodes(appDirectory.children);
      if (E.isLeft(r)) throw r.left;
      expect(r.right.length).toEqual(size);
    });
  });

  describe("#installNodes", () => {
    it.todo("works");
  });
});
