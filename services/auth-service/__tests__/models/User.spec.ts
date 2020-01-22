import { sharedContext } from "../shared";
import { User } from "../../src/models";

sharedContext.hasDbConnection("test-models-User");

describe("User", () => {
  it("can create", async () => {
    const params = { name: "hoge", email: "hoge@gmail.com", password: "hogehoge" };
    await User.create(params);

    const ruser = await User.findOne({name: params.name, email: params.email});
    if (ruser === null) throw new Error("user not found");
    expect(ruser.name).toEqual(params.name);
    expect(ruser.email).toEqual(params.email);
  });

  describe("#email", () => {
    it("is unique", async () => {
      const params1 = { name: "hoge", email: "domo@gmail.com", password: "hoge" };
      const params2 = { name: "hoge2", email: "domo@gmail.com", password: "hoge" };

      await User.create(params1);
      User.create(params2, (err: Error) => {
        expect(err).toBeInstanceOf(Error);
      });
    });
  });
});
