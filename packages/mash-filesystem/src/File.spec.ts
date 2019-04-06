import { File } from './File';

describe('File', () => {
  it('should have basic properties', () => {
    const file = new File({ name: 'file' });
    file.setContent('content');

    expect(file.name).toEqual('file');
    expect(file.cid).toBeDefined();
    expect(file.createdAt).toBeDefined();
    expect(file.content).toEqual('content');
  });
});
