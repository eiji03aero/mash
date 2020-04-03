import mongoose from "mongoose";
import { sharedContext } from "../shared";
import { Logout } from "../../src/usecases";

sharedContext.hasDbConnection("test-usecases-Logout");

describe("Logout", () => {
  it("works", async () => {
    const params = {
      name: "hoge",
      email: "hoge@gmail.com",
      password: "hogehoge",
    };
    const user = await sharedContext.hasUser(params);

    const ruser = await new Logout().execute({
      id: user.id
    });

    if (ruser instanceof Error) throw ruser;

    expect(ruser).toBeInstanceOf(mongoose.Model);
  });

  it("returns error when id not exist", async () => {
    const params = {
      name: "hoge",
      email: "hoge@gmail.com",
      password: "hogehoge",
    };
    const wrongId = "hoge-soudesu";
    await sharedContext.hasUser(params);

    const ruser = await new Logout().execute({
      id: wrongId,
    });

    expect(ruser).toBeInstanceOf(Error);
  });
});
