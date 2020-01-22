import { User } from "../models";

export class Logout {
  async execute ({
    id,
  }: {
    id: string;
  }) {
    const user = await User.findById(id);
    if (user === null) return new Error("user not found");

    user.rememberToken = "";
    await user.save();

    return user;
  }
}
