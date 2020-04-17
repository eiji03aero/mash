import { CommandMap } from "../types";

import basename from "./basename";
import cat from "./cat";
import cd from "./cd";
import dirname from "./dirname";
import echo from "./echo";
import ls from "./ls";
import login from "./login";
import mkdir from "./mkdir";
import pwd from "./pwd";
import rm from "./rm";
import signup from "./signup";
import touch from "./touch";

export const builtins: CommandMap = {
  basename,
  cat,
  cd,
  dirname,
  echo,
  ls,
  login,
  mkdir,
  pwd,
  rm,
  signup,
  touch,
};
