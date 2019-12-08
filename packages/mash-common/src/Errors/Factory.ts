import { NoSuchFileOrDirectory } from "./NoSuchFileOrDirectory";
import { NotDirectory } from "./NotDirectory";
import { Script } from "./Script";
import { Standard } from "./Standard";

export class Factory {

  public static standard(msg: string) {
    return new Standard({ msg });
  }

  public static noSuchFileOrDirectory(path: string) {
    return new NoSuchFileOrDirectory({ path });
  }

  public static notDirectory(name: string) {
    return new NotDirectory({ name });
  }

  public static script(fileName: string, errorMessage: string) {
    return new Script({ fileName, errorMessage });
  }
  private constructor() {}
}
