import { FileSystem } from "../src/FileSystem";
import { Directory } from "../src/Directory";


describe('FileSystem', () => {
  let fs = FileSystem.bootstrap();

  beforeEach(() => {
    fs = FileSystem.reboot();
  });

  it('should have basic properties', () => {
    expect(fs).toBeInstanceOf(FileSystem);
    expect(fs.currentDirectory).toBeInstanceOf(Directory);
    expect(fs.root).toBeInstanceOf(Directory);
  });

  it('should change current directory', () => {
    const result = fs.changeCurrentDirectory({ path: './Applications' });
    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.name).toEqual('Applications');

    const result2 = fs.changeCurrentDirectory({ path: '..' });
    expect(result2).not.toHaveProperty('error');
    expect(fs.currentDirectory.name).toEqual('home');
  });

  it('should create file', () => {
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

  it('should create directory', () => {
    const directoryParams = {
      name: 'hoge',
    };
    const result = fs.createDirectory({
      path: '.',
      params: directoryParams
    });
    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.containsByName(directoryParams.name)).toBe(true);
    expect(result.directory!.parentNode).toBe(fs.currentDirectory);
  })
});
