import { File } from '../src/File';

describe('File', () => {
  it('should have basic properties', () => {
    const fileParams = {
      name: 'file',
      content: 'content'
    };
    const file = new File(fileParams);

    expect(file.name).toEqual(fileParams.name);
    expect(file.content).toEqual(fileParams.content);
    expect(file.cid).toBeDefined();
    expect(file.createdAt).toBeDefined();
  });
});
