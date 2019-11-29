import { Standard } from './Standard';
import { NoSuchFileOrDirectory } from './NoSuchFileOrDirectory';
import { NotDirectory } from './NotDirectory';
import { Script } from './Script';

export class Factory {
  private constructor () {}

  static standard (msg: string) {
    return new Standard({ msg });
  }

  static noSuchFileOrDirectory (path: string) {
    return new NoSuchFileOrDirectory({ path });
  }

  static notDirectory (name: string) {
    return new NotDirectory({ name });
  }

  static script (fileName: string, errorMessage: string) {
    return new Script({ fileName, errorMessage });
  }
}
