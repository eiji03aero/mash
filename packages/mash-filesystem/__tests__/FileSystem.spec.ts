import { FileSystem } from "../src/FileSystem";
import { Directory } from "../src/Directory";

describe('FileSystem', () => {
  it('should have basic properties', () => {
    const fs = FileSystem.bootstrap().instance;

    expect(FileSystem.instance).toBeInstanceOf(FileSystem);
    expect(fs.currentDirectory).toBeInstanceOf(Directory);
    expect(fs.root).toBeInstanceOf(Directory);
  });
});
