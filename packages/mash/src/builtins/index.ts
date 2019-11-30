import { ICommandMap } from '../types';

import cd from './cd';
import echo from './echo';
import pwd from './pwd';
import dirname from './dirname';

export const builtins: ICommandMap = {
  cd,
  echo,
  pwd,
  dirname
};
