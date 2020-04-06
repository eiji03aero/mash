import { Monad } from "mash-common";
import { sharedContext } from "./shared";
import { INodeStore, IDirectory } from "../src/types";
import { NodeStore } from "../src/NodeStore";

describe("NodeStore", () => {
  let nodeStore: INodeStore;
  let root: IDirectory;

  beforeEach(() => {
    nodeStore = new NodeStore();
    root = sharedContext.hasDirectory();
    nodeStore.setRootDirectory(root);
  });

  describe("#addNode", () => {
    it("works", () => {
      const size = nodeStore.size;
      const file = sharedContext.hasFile();
      const result = nodeStore.addNode({
        node: file,
        parentNodeId: root.id
      });
      if (Monad.either.isLeft(result)) throw result.error;

      expect(nodeStore.size).toEqual(size + 1);
    });
  });

  describe("#deleteNode", () => {
    it("works", () => {
      const size = nodeStore.size;
      const file = sharedContext.hasFile();
      nodeStore.addNode({
        node: file,
        parentNodeId: root.id,
      });

      const result = nodeStore.deleteNode(file.id);
      if (Monad.either.isLeft(result)) throw result.error;

      expect(nodeStore.size).toEqual(size);
    });

    it("deletes recursively", () => {
      const size = nodeStore.size;
      const rootChildrenLength = root.children.length;
      const dir = sharedContext.hasDirectory();
      const file = sharedContext.hasFile();
      nodeStore.addNode({
        node: dir,
        parentNodeId: root.id,
      });
      nodeStore.addNode({
        node: file,
        parentNodeId: dir.id,
      });

      expect(root.children.length).toEqual(rootChildrenLength + 1);
      expect(nodeStore.size).toEqual(size + 2);

      const result = nodeStore.deleteNode(dir.id);
      if (Monad.either.isLeft(result)) throw result.error;

      expect(root.children.length).toEqual(rootChildrenLength);
      expect(nodeStore.size).toEqual(size);
    });
  });

  describe("#getNode", () => {
    it("works", () => {
      const file = sharedContext.hasFile();
      nodeStore.addNode({
        node: file,
        parentNodeId: root.id,
      });

      const result = nodeStore.getNode(file.id);
      if (Monad.either.isLeft(result)) throw result.error;

      expect(result.value).toBe(file);
    });
  });

  describe("#getNodes", () => {
    it("works", () => {
      const file = sharedContext.hasFile();
      const file2 = sharedContext.hasFile();
      nodeStore.addNode({
        node: file,
        parentNodeId: root.id,
      });
      nodeStore.addNode({
        node: file2,
        parentNodeId: root.id,
      });

      const result = nodeStore.getNodes([file.id, file2.id]);
      if (Monad.either.isLeft(result)) throw result.error;

      expect(result.value.length).toEqual(2);
      expect(result.value.includes(file)).toBeTruthy();
      expect(result.value.includes(file2)).toBeTruthy();

      const result2 = nodeStore.getNodes(["unknown id", file2.id]);
      if (Monad.either.isLeft(result2)) throw result2.error;

      expect(result2.value.length).toEqual(1);
      expect(result2.value.includes(file2)).toBeTruthy();
    });
  });

  describe("#resolveAbsolutePath", () => {
    it("works", () => {
      const dir = sharedContext.hasDirectory({name: "dir"});
      const file = sharedContext.hasFile({name: "file"});
      nodeStore.addNode({
        node: dir,
        parentNodeId: root.id,
      });
      nodeStore.addNode({
        node: file,
        parentNodeId: dir.id,
      });

      const tests = [
        {
          id: file.id,
          expected: "/dir/file",
        },
        {
          id: dir.id,
          expected: "/dir",
        },
      ];

      for (const t of tests) {
        const result = nodeStore.resolveAbsolutePath(t.id);
        if (Monad.either.isLeft(result)) throw result.error;
        expect(result.value).toEqual(t.expected);
      }
    });
  });

  describe("#resolveNodeFromPath", () => {
    it("works", () => {
      const dir = sharedContext.hasDirectory({name: "dir"});
      const dir2 = sharedContext.hasDirectory({name: "dir2"});
      const file = sharedContext.hasFile({name: "file"});
      nodeStore.addNode({
        node: dir,
        parentNodeId: root.id,
      });
      nodeStore.addNode({
        node: dir2,
        parentNodeId: root.id,
      });
      nodeStore.addNode({
        node: file,
        parentNodeId: dir.id,
      });

      const tests = [
        {
          path: "/dir/file",
          expected: file,
          currentDirectoryId: dir.id,
        },
        {
          path: "/dir",
          expected: dir,
          currentDirectoryId: dir.id,
        },
        {
          path: "../dir2",
          expected: dir2,
          currentDirectoryId: dir.id,
        },
      ];

      for (const t of tests) {
        const result = nodeStore.resolveNodeFromPath({ currentDirectoryId: t.currentDirectoryId, path: t.path});
        if (Monad.either.isLeft(result)) throw result.error;
        expect(result.value).toEqual(t.expected);
      }
    });
  });
});