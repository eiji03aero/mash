import { FileSystem } from "../src/FileSystem";
import { Directory } from "../src/Directory";
import { File } from "../src/File";


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
    const result = fs.createNode({
      path: '.',
      params: fileParams
    });
    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.containsByName(fileParams.name)).toBe(true);
    expect(result.node!.parentNode).toBe(fs.currentDirectory);
  });

  it('should create directory', () => {
    const directoryParams = {
      name: 'application child directory',
      children: []
    };
    const result = fs.createNode({
      path: '.',
      params: directoryParams
    });
    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.containsByName(directoryParams.name)).toBe(true);
    expect(result.node!.parentNode).toBe(fs.currentDirectory);
  });

  it('should update file', () => {
    const fileParams = {
      name: 'file',
      content: 'hm'
    };
    fs.createNode({
      path: '.',
      params: fileParams
    });

    const updatedFileParams = {
      name: 'updated file',
      content: 'yay'
    };
    const result = fs.updateNode<File>({
      path: `./${fileParams.name}`,
      params: updatedFileParams,
    });

    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.containsByName(updatedFileParams.name)).toBe(true);

    const file = result.node!;
    expect(file.parentNode).toBe(fs.currentDirectory);
    expect(file.name).toBe(updatedFileParams.name);
    expect(file.content).toBe(updatedFileParams.content);
  });


  it('should update directory', () => {
    const directoryParams = {
      name: 'dir',
    };
    fs.createNode<Directory>({
      path: '.',
      params: directoryParams
    });

    const updatedDirectoryParams = {
      name: 'updated dir',
    };
    const result = fs.updateNode<Directory>({
      path: `./${directoryParams.name}`,
      params: updatedDirectoryParams,
    });

    expect(result).not.toHaveProperty('error');
    expect(fs.currentDirectory.containsByName(updatedDirectoryParams.name)).toBe(true);

    const directory = result.node!;
    expect(directory.parentNode).toBe(fs.currentDirectory);
    expect(directory.name).toBe(updatedDirectoryParams.name);
  });
});
