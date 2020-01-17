import { Request, Response } from "express";
import { User } from "../models";
import {
  UserAPI,
  FileSystemAPI,
} from "../datasources";

const datasources = {
  userAPI: new UserAPI,
  fileSystemAPI: new FileSystemAPI,
};

export const getContext = async (req: Request, res: Response) => {
  const currentUser = await User.findOne();
  return {
    req,
    res,
    currentUser,
    datasources,
  };
};
