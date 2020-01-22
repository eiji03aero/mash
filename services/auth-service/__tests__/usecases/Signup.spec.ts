import mongoose from "mongoose";
import { sharedContext } from "../shared";
import { Signup } from "../../src/usecases";

sharedContext.hasDbConnection("test-usecases-Signup");

describe("Signup", () => {
  it("works", async () => {
    const params = {
      name: "hoge",
      email: "hoge@gmail.com",
      password: "hogedesu"
    };
    const user = await new Signup().execute(params);
    expect(user).toBeInstanceOf(mongoose.Model);
    expect(user.name).toEqual(params.name);
    expect(user.email).toEqual(params.email);
  });
});
