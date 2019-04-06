import { FileSystemNode } from '../src/FileSystemNode';

describe('FileSystemNode', () => {
  it('should have basic property defined', () => {
    const node = new FileSystemNode({ name: 'test' });

    expect(node.name).toEqual('test');
    expect(node.cid).toBeDefined();
    expect(node.createdAt).toBeDefined();
  });

  it('should be able to hold parent node', () => {
    const node = new FileSystemNode({ name: 'test' });
    const parentNode = new FileSystemNode({ name: 'parentNode' });

    node.setParentNode(parentNode);

    expect(node.parentNode).toBe(parentNode);
  });
});
