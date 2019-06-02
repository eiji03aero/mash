import { FileSystem } from "../src/FileSystem";
import { Directory } from "../src/Directory";

describe('FileSystem', () => {
  it('should have basic properties', () => {
    const fs = FileSystem.bootstrap().instance;

    expect(fs).toBeInstanceOf(FileSystem);
    expect(fs.currentDirectory).toBeInstanceOf(Directory);
    expect(fs.root).toBeInstanceOf(Directory);
  });

  it('should change current directory', () => {
    const fs = FileSystem.bootstrap().instance;

    const result = fs.changeCurrentDirectory({ path: './Applications' });
    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.name).toEqual('Applications');

    const result2 = fs.changeCurrentDirectory({ path: '..' });
    expect(result2).not.toHaveProperty('error');
    expect(fs.currentDirectory.name).toEqual('home');
  });

  it('should create file', () => {
    const fs = FileSystem.bootstrap().instance;

    const fileParams = {
      name: 'application child',
      content: 'application content'
    };
    const result = fs.createFile({
      path: '.',
      params: fileParams
    });
    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.containsByName(fileParams.name)).toBe(true);
    expect(result.file!.parentNode).toBe(fs.currentDirectory);
  })
});
