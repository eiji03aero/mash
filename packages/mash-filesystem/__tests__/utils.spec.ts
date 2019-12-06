import {
  IFileSystemNode
} from '../src/types';
import {
  utils,
  Directory,
  File
} from '../src';

describe('utils', () => {
  describe('isDirectory', () => {
    it('should tell if it is instance of Directory', () => {
      const dir = new Directory({ name: 'dir' }) as IFileSystemNode;
      const result = utils.isDirectory(dir);
      expect(result).toBeTruthy();
    });
  });

  describe('isFile', () => {
    it('should tell if it is instance of File', () => {
      const file = new File({ name: 'file' }) as IFileSystemNode;
      const result = utils.isFile(file);
      expect(result).toBeTruthy();
    });
  });
});
