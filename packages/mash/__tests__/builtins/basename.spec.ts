import { sharedContext, sharedTest } from '../shared';

describe('builtins.basename', () => {
  it('should print the last fragment of path', () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    env.eval(`basename /home/app`);
    expect(onWriteMock).toBeCalledWith([{ text: 'app' }]);
  });

  it('should print the string passed when passed invalid path', () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    env.eval(`basename hoge_desu_kore`);
    expect(onWriteMock).toBeCalledWith([{ text: 'hoge_desu_kore' }]);
  });

  it('should exit error when argument not enough', () => {
    const { env } = sharedContext.hasMockEnvironment();
    env.eval(`basename`);
    sharedTest.expectExitFail(env);
  });
});
