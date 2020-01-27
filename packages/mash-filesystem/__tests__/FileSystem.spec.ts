import { Monad } from "mash-common";
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
    if (Monad.either.isLeft(r)) throw r.error;
    rootDirectory = r.value as IDirectory;

    const r2 = fs.createDirectory({
      parentNodeId: fs.currentDirectory.id,
      params: sharedContext.hasDirectoryBasis({
        name: "app",
      }),
    });
    if (Monad.either.isLeft(r2)) throw r2.error;
    appDirectory = r2.value;

    const r3 = fs.createFile({
      parentNodeId: appDirectory.id,
      params: sharedContext.hasFileBasis({
        name: "domo",
        content: "hm hm",
      }),
    });
    if (Monad.either.isLeft(r3)) throw r3.error;
    domoFile = r3.value;
  });

  describe("#createFile", () => {
    it("works", () => {
      const fileParams = sharedContext.hasFileBasis();
      const r = fs.createFile({
        parentNodeId: fs.currentDirectory.id,
        params: fileParams,
      });
      expect(r.isError).toBeFalsy();
    });
  });

  describe("#deleteFile", () => {
    it("works", () => {
      const size = fs.size;
      const r = fs.deleteFile(domoFile.id);
      if (r.isError) throw r.error;
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
      expect(r.isError).toBeFalsy();
    });
  });

  describe("#deleteDirectory", () => {
    it("works", () => {
      const size = fs.size;
      const r = fs.deleteDirectory(appDirectory.id);
      if (r.isError) throw r.error;
      expect(fs.size).toEqual(size - 2);
    });
  });

  describe("#changeCurrentDirectory", () => {
    it("works", () => {
      const r = fs.changeCurrentDirectory(appDirectory.id);
      if (Monad.either.isLeft(r)) throw r.error;
      expect(fs.currentDirectory.name).toEqual("app");
    });

    it("returns error when path not existed passed", () => {
      const r = fs.changeCurrentDirectory("unknown id");
      expect(r.isError).toBeTruthy();
    });
  });

  describe("#resolveNodeFromPath", () => {
    it("works", () => {
      const r = fs.resolveNodeFromPath("./app");
      if (Monad.either.isLeft(r)) throw r.error;
      expect(r.value.id).toEqual(appDirectory.id);

      const r2 = fs.resolveNodeFromPath("/");
      if (Monad.either.isLeft(r2)) throw r2.error;
      expect(r2.value.id).toEqual(rootDirectory.id);
    });
  });

  describe("#resolveAbsolutePath", () => {
    it("works", () => {
      const r = fs.resolveAbsolutePath(appDirectory.id);
      if (Monad.either.isLeft(r)) throw r.error;

      expect(r.value).toEqual("/home/app")
    });
  });

  describe("#getNodes", () => {
    it("works", () => {
      const size = appDirectory.children.length;
      const r = fs.getNodes(appDirectory.children);
      if (Monad.either.isLeft(r)) throw r.error;
      expect(r.value.length).toEqual(size);
    });
  });
});
