import { sharedContext } from '../shared';

describe('builtins.pwd', () => {
  it('should print the current working directory', () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    env.eval('pwd');
    expect(onWriteMock).toBeCalledWith([{ text: '/home' }]);
  });
});
