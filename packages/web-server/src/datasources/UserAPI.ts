import { Response } from "express";
import uuid from "uuid/v4";
import {
  IUserAPI,
} from "../types";
import { User } from "../models";

export class UserAPI implements IUserAPI {
  async signup ({
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

  async login ({
    email,
    password,
    res,
  }: {
    email: string;
    password: string;
    res: Response;
  }) {
    const user = await User.findOne({ email });

    if (user === null) return new Error("user not found");

    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) return new Error("password not correct");

    user.rememberToken = uuid();
    await user.save();

    const cookieOption = {
      path: "/",
      expires: new Date(Date.now() + 3600 * 24 * 365 * 20),
    };
    res.cookie("userId", user.id, cookieOption);
    res.cookie("rememberToken", user.rememberToken, cookieOption);
    return user;
  }

  async logout ({
    email,
    res,
  }: {
    email: string;
    res: Response;
  }) {
    const user = await User.findOne({ email });

    if (user === null) return new Error("user not found");

    user.rememberToken = "";
    await user.save();

    res.clearCookie("userId");
    res.clearCookie("rememberToken");
    return user;
  }
}
