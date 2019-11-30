import * as context from '../shared/context';

describe('builtins.echo', () => {
  it('should print whatever arguments passed', () => {
    const { env } = context.hasMockEnvironment();
    env.eval('echo domo desu');
  });
});
