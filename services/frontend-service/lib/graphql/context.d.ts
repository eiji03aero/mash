import { Request, Response } from "express";
import { UserAPI, FileSystemAPI } from "../datasources";
export declare const getContext: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response) => Promise<{
    req: Request<import("express-serve-static-core").ParamsDictionary>;
    res: Response;
    currentUser: import("../types").IUser | null;
    datasources: {
        userAPI: UserAPI;
        fileSystemAPI: FileSystemAPI;
    };
}>;
//# sourceMappingURL=context.d.ts.map