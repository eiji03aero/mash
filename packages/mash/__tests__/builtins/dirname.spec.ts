import { ExitStatus } from '../../src/types';
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

  it('should exit error when argument not enough', () => {
    const { env } = context.hasMockEnvironment();
    env.eval(`dirname`);
    expect(env.exitStatus).toEqual(ExitStatus.Failure);
  });
});
