import { ICommandMap } from '../types';

import basename from './basename';
import cd from './cd';
import dirname from './dirname';
import echo from './echo';
import pwd from './pwd';
import touch from './touch';
import mkdir from './mkdir';
import ls from './ls';

export const builtins: ICommandMap = {
  basename,
  cd,
  dirname,
  echo,
  pwd,
  touch,
  mkdir,
  ls,
};
