import { Monad } from "mash-common";
import { FileSystem } from "../src/FileSystem";
import { Directory } from "../src/Directory";

describe("FileSystem", () => {
  let fs = FileSystem.bootstrap();

  beforeEach(() => {
    fs = FileSystem.reboot();
  });

  it("should have basic properties", () => {
    expect(fs).toBeInstanceOf(FileSystem);
    expect(fs.currentDirectory).toBeInstanceOf(Directory);
    expect(fs.root).toBeInstanceOf(Directory);
  });

  it("should change current directory", () => {
    const result = fs.changeCurrentDirectory("./Applications");
    expect(result).not.toHaveProperty("error");
    expect(fs.currentDirectory.name).toEqual("Applications");

    const result2 = fs.changeCurrentDirectory("../");
    expect(result2).not.toHaveProperty("error");
    expect(fs.currentDirectory.name).toEqual("home");
  });

  it("should resolve node from path", () => {
    const result = fs.resolveNodeFromPath("/home");
    expect(result.isError).toBeFalsy();
    if (Monad.either.isRight(result)) {
      expect(result.value.name).toEqual("home");
    }
  });

  it("should resolve absolute path for node", () => {
    const result = fs.resolveAbsolutePath(fs.currentDirectory);
    expect(result).toEqual("/home");
  });

  it("should create file", () => {
    const name = "application_child";
    const result = fs.createFile(name);
    expect(result.isError).toBeFalsy();
    expect(fs.currentDirectory.containsByName(name)).toBe(true);
  });

  it("should create directory", () => {
    const name = "application_child_directory";
    const result = fs.createDirectory(name);
    expect(result.isError).toBeFalsy();
    expect(fs.currentDirectory.containsByName(name)).toBe(true);
  });

  it("should delete file", () => {
    const name = "file";
    fs.createFile(name);

    const result = fs.deleteFile(name);
    expect(result.isError).toBeFalsy();
    expect(fs.currentDirectory.containsByName(name)).toBe(false);
  });

  it("should delete directory", () => {
    const name = "dir";
    fs.createDirectory(name);

    const result = fs.deleteDirectory(name);
    expect(result.isError).toBeFalsy();
    expect(fs.currentDirectory.containsByName(name)).toBeFalsy();
  });

  it.todo("should change file name");
  it.todo("should change directory name");
});
