import * as E from "fp-ts/lib/Either";
import { sharedContext, installFixtureNodes } from "./shared";
import { IFileSystem, IFile, IDirectory } from "../src/types";
import { FileSystem } from "../src/FileSystem";
import * as utils from "../src/utils";

describe("FileSystem", () => {
  let fs: IFileSystem;
  let rootDirectory: IDirectory;
  let appDirectory: IDirectory;
  let domoFile: IFile;

  beforeEach(async () => {
    fs = FileSystem.reboot();
    installFixtureNodes(fs);

    const r = fs.resolveNodeFromPath("/");
    if (E.isLeft(r)) throw r.left;
    rootDirectory = r.right as IDirectory;

    const r2 = await fs.createDirectory({
      parentNodeId: fs.currentDirectory.id,
      params: sharedContext.hasDirectoryBasis({
        name: "app",
      }),
    });
    if (E.isLeft(r2)) throw r2.left;
    appDirectory = r2.right;

    const r3 = await fs.createFile({
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
    it("works", async () => {
      const fileParams = sharedContext.hasFileBasis();
      const r = await fs.createFile({
        parentNodeId: fs.currentDirectory.id,
        params: fileParams,
      });
      expect(E.isLeft(r)).toBeFalsy();
    });

    it("has middleware working", async () => {
      let flag = false;
      fs.addMiddleware({
        type: "file:beforeCreate",
        callback: async () => {
          flag = true;
          return E.right(null);
        }
      });
      fs.addMiddleware({
        type: "file:beforeCreate",
        callback: async () => {
          return E.left(new Error("hoge"));
        }
      });
      const fileParams = sharedContext.hasFileBasis();
      const r = await fs.createFile({
        parentNodeId: fs.currentDirectory.id,
        params: fileParams,
      });
      expect(E.isLeft(r)).toBeTruthy();
      expect(flag).toBeTruthy();
    });
  });

  describe("#deleteFile", () => {
    it("works", async () => {
      const size = fs.size;
      const r = await fs.deleteFile({id: domoFile.id});
      if (E.isLeft(r)) throw r.left;
      expect(fs.size).toEqual(size - 1);
    });
  });

  describe("#createDirectory", () => {
    it("works", async () => {
      const directoryParams = sharedContext.hasDirectoryBasis();
      const r = await fs.createDirectory({
        parentNodeId: fs.currentDirectory.id,
        params: directoryParams,
      });
      expect(E.isLeft(r)).toBeFalsy();
    });
  });

  describe("#deleteDirectory", () => {
    it("works", async () => {
      const size = fs.size;
      const r = await fs.deleteDirectory({ id: appDirectory.id});
      if (E.isLeft(r)) throw r.left;
      expect(fs.size).toEqual(size - 2);
    });
  });

  describe("#createNodeByPath", () => {
    it("creates file", async () => {
      const path = "/cnb.txt";
      const r1 = await fs.createNodeByPath(path);
      if (E.isLeft(r1)) throw r1.left;
      const r2 = fs.resolveNodeFromPath(path);
      if (E.isLeft(r2)) throw r2.left;
      const file = r2.right;
      expect(utils.isFile(file)).toBeTruthy();
      expect(file.name).toEqual("cnb.txt");
    });

    it("creates directory", async () => {
      const path = "/cnb/";
      const r1 = await fs.createNodeByPath(path);
      if (E.isLeft(r1)) throw r1.left;
      const r2 = fs.resolveNodeFromPath(path);
      if (E.isLeft(r2)) throw r2.left;
      const dir = r2.right;
      expect(utils.isDirectory(dir)).toBeTruthy();
      expect(dir.name).toEqual("cnb");
    });
  });

  describe("#moveNodeByPath", () => {
    it("moves node", async () => {
      const r1 = await fs.createNodeByPath("/mnb/");
      if (E.isLeft(r1)) throw r1.left;
      const r2 = await fs.createNodeByPath("/mnb/domo.txt");
      if (E.isLeft(r2)) throw r2.left;
      const r3 = await fs.moveNodeByPath({
        nodeId: r2.right.id,
        path: "/domo2.txt",
      });
      if (E.isLeft(r3)) throw r3.left;

      const r4 = fs.resolveNodeFromPath("/mnb");
      if (E.isLeft(r4)) throw r4;
      expect((r4.right as IDirectory).children.length).toEqual(0);

      const r5 = fs.resolveNodeFromPath("/domo2.txt");
      if (E.isLeft(r5)) throw r5.left;
      expect(r5.right.id).toEqual(r2.right.id);
      expect(r5.right.name).toEqual("domo2.txt");
    });
  });

  describe("#deleteNodeByPath", () => {
    it("deletes node", async () => {
      const path = "/dnb.txt";
      const r1 = await fs.createNodeByPath(path);
      if (E.isLeft(r1)) throw r1.left;
      const r2 = await fs.deleteNodeByPath(path);
      if (E.isLeft(r2)) throw r2.left;

      const r3 = fs.resolveNodeFromPath("/");
      if (E.isLeft(r3)) throw r3.left;
      expect((r3.right as IDirectory).children).not.toContain(r1.right.id);
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
