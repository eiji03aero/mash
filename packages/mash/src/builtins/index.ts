import { ICommandMap } from "../types";

import basename from "./basename";
import cat from "./cat";
import cd from "./cd";
import dirname from "./dirname";
import echo from "./echo";
import ls from "./ls";
import mkdir from "./mkdir";
import pwd from "./pwd";
import rm from "./rm";
import touch from "./touch";

export const builtins: ICommandMap = {
  basename,
  cd,
  dirname,
  echo,
  pwd,
  touch,
  mkdir,
  ls,
  cat,
  rm,
};
