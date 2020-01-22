import mongoose from "mongoose";
import { sharedContext } from "../shared";
import { Login } from "../../src/usecases";

sharedContext.hasDbConnection("test-usecases-Login");

describe("Login", () => {
  it("works", async () => {
    const params = {
      name: "hoge",
      email: "hoge@gmail.com",
      password: "hogehoge",
    };
    await sharedContext.hasUser(params);

    const ruser = await new Login().execute({
      email: params.email,
      password: params.password,
    });

    if (ruser instanceof Error) throw ruser;

    expect(ruser).toBeInstanceOf(mongoose.Model);
  });

  it("returns error when email not exist", async () => {
    const params = {
      name: "hoge",
      email: "hoge@gmail.com",
      password: "hogehoge",
    };
    const wrongEmail = "kore@domo.com";
    await sharedContext.hasUser(params);

    const ruser = await new Login().execute({
      email: wrongEmail,
      password: params.password,
    });

    expect(ruser).toBeInstanceOf(Error);
  });

  it("returns error when password not correct", async () => {
    const params = {
      name: "hoge",
      email: "hoge@gmail.com",
      password: "hogehoge",
    };
    const wrongPassword = "korekaina";
    await sharedContext.hasUser(params);

    const ruser = await new Login().execute({
      email: params.email,
      password: wrongPassword,
    });

    expect(ruser).toBeInstanceOf(Error);
  });
});
