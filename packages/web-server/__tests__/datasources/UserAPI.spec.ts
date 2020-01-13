import { Response } from "express";
import mongoose from "mongoose";
import { sharedContext } from "../shared";
import { IUserAPI } from "../../src/types";
import { UserAPI } from "../../src/datasources";

sharedContext.hasDbConnection("test-datasources-UserAPI");

describe("UserAPI", () => {
  let userAPI: IUserAPI;

  beforeEach(async () => {
    userAPI = new UserAPI;
  });

  describe("#signup", () => {
    it("works", async () => {
      const params = {
        name: "hoge",
        email: "hoge@gmail.com",
        password: "hogedesu"
      };
      const user = await userAPI.signup(params);
      expect(user.name).toEqual(params.name);
      expect(user.email).toEqual(params.email);
    });
  });

  describe("#login", () => {
    it("works", async () => {
      const params = {
        name: "hoge",
        email: "hoge@gmail.com",
        password: "hogehoge",
      };
      await sharedContext.hasUser(params);

      const mockCookieFunc = jest.fn();
      const mockResponse = { cookie: mockCookieFunc } as any as Response;
      const ruser = await userAPI.login({
        email: params.email,
        password: params.password,
        res: mockResponse,
      });

      if (ruser instanceof Error) throw ruser;

      expect(ruser).toBeInstanceOf(mongoose.Model);
      const cookieTests = [
        ["userId", ruser.id],
        ["rememberToken", ruser.rememberToken]
      ];
      for (let i = 0; i < cookieTests.length; i++) {
        const args = mockCookieFunc.mock.calls[i];
        const t = cookieTests[i];
        expect(args[0]).toEqual(t[0]);
        expect(args[1]).toEqual(t[1]);
      }
    });

    it("throws error when email not exist", async () => {
      const params = {
        name: "hoge",
        email: "hoge@gmail.com",
        password: "hogehoge",
      };
      const wrongEmail = "kore@domo.com";
      await sharedContext.hasUser(params);

      const ruser = await userAPI.login({
        email: wrongEmail,
        password: params.password,
        res: {} as any,
      });

      expect(ruser).toBeInstanceOf(Error);
    });

    it("throws error when password not correct", async () => {
      const params = {
        name: "hoge",
        email: "hoge@gmail.com",
        password: "hogehoge",
      };
      const wrongPassword = "korekaina";
      await sharedContext.hasUser(params);

      const ruser = await userAPI.login({
        email: params.email,
        password: wrongPassword,
        res: {} as any,
      });

      expect(ruser).toBeInstanceOf(Error);
    });
  });

  describe("#logout", () => {
    it("works", async () => {
      const params = {
        name: "hoge",
        email: "hoge@gmail.com",
        password: "hogehoge",
      };
      await sharedContext.hasUser(params);

      const mockClearCookieFunc = jest.fn();
      const mockResponse = { clearCookie: mockClearCookieFunc } as any as Response;
      const ruser = await userAPI.logout({
        email: params.email,
        res: mockResponse,
      });

      if (ruser instanceof Error) throw ruser;

      expect(ruser).toBeInstanceOf(mongoose.Model);
      const cookieTest = [
        ["userId"],
        ["rememberToken"],
      ];
      for (let i = 0; i < cookieTest.length; i++) {
        const args = mockClearCookieFunc.mock.calls[i];
        const t = cookieTest[i];
        expect(args[0]).toEqual(t[0]);
      }
    });

    it("throws error when email not exist", async () => {
      const params = {
        name: "hoge",
        email: "hoge@gmail.com",
        password: "hogehoge",
      };
      const wrongEmail = "kore@domo.com";
      await sharedContext.hasUser(params);

      const ruser = await userAPI.logout({
        email: wrongEmail,
        res: {} as any,
      });

      expect(ruser).toBeInstanceOf(Error);
    })
  });
});
