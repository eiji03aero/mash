import { User } from "../models";

export class Signup {
  async execute ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const user = new User({ name, email, password });
    await user.save();
    return user;
  }
}
