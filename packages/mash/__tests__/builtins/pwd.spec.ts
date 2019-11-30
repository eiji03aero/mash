import * as context from '../shared/context';

describe('builtins.pwd', () => {
  it('should print the current working directory', () => {
    const { env, onWriteMock } = context.hasMockEnvironment();
    env.eval('pwd');
    expect(onWriteMock).toBeCalledWith([{ text: '/home' }]);
  });
});
