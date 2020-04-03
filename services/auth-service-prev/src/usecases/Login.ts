import { User } from "../models";
import uuid from "uuid/v4";

export class Login {
  async execute ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const user = await User.findOne({ email });
    if (user === null) return new Error("user not found");

    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) return new Error("password not correct");

    user.rememberToken = uuid();
    await user.save();

    return user;
  }
}
