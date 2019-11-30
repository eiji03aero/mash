import * as context from '../shared/context';

describe('builtins.dirname', () => {
  it('should print directory path', () => {
    const { env, onWriteMock } = context.hasMockEnvironment();
    env.eval(`dirname /home/app`);
    expect(onWriteMock).toBeCalledWith([{ text: '/home' }]);
  });

  it('should print dot when passed invalid path', () => {
    const { env, onWriteMock } = context.hasMockEnvironment();
    env.eval(`dirname hogehoge`);
    expect(onWriteMock).toBeCalledWith([{ text: '.' }]);
  });
});
