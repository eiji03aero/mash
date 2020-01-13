import { Response } from "express";
import { IUserAPI } from "../types";
export declare class UserAPI implements IUserAPI {
    signup({ name, email, password, }: {
        name: string;
        email: string;
        password: string;
    }): Promise<import("../types").IUser>;
    login({ email, password, res, }: {
        email: string;
        password: string;
        res: Response;
    }): Promise<Error | import("../types").IUser>;
    logout({ email, res, }: {
        email: string;
        res: Response;
    }): Promise<Error | import("../types").IUser>;
}
//# sourceMappingURL=UserAPI.d.ts.map