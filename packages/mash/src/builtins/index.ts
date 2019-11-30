import {
  ICommandMap
} from '../types';

import cd from './cd';
import echo from './echo';

export const builtins: ICommandMap = {
  cd,
  echo
};
