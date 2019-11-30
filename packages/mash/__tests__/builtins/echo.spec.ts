import * as context from '../shared/context';

describe('builtins.echo', () => {
  it('should print whatever arguments passed', () => {
    const { env, onWriteMock } = context.hasMockEnvironment();
    const text = 'domo desu';
    env.eval(`echo ${text}`);
    expect(onWriteMock).toBeCalledWith([{ text }]);
  });
});
