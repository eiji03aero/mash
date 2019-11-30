import { ExitStatus } from '../../src/types';
import * as context from '../shared/context';

describe('builtins.basename', () => {
  it('should print the last fragment of path', () => {
    const { env, onWriteMock } = context.hasMockEnvironment();
    env.eval(`basename /home/app`);
    expect(onWriteMock).toBeCalledWith([{ text: 'app' }]);
  });

  it('should print the string passed when passed invalid path', () => {
    const { env, onWriteMock } = context.hasMockEnvironment();
    env.eval(`basename hoge_desu_kore`);
    expect(onWriteMock).toBeCalledWith([{ text: 'hoge_desu_kore' }]);
  });

  it('should exit error when argument not enough', () => {
    const { env } = context.hasMockEnvironment();
    env.eval(`basename`);
    expect(env.exitStatus).toEqual(ExitStatus.Failure);
  });
});
