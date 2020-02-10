import { sharedContext } from "../shared";

describe("builtins.echo", () => {
  it("should print whatever arguments passed", () => {
    const { env, onWriteMock } = sharedContext.hasMockEnvironment();
    const text = "domo desu";
    env.eval(`echo ${text}`);
    expect(onWriteMock).toBeCalledWith(text);
  });
});
