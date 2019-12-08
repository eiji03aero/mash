import { NoSuchFileOrDirectory } from "./NoSuchFileOrDirectory";
import { NotDirectory } from "./NotDirectory";
import { Script } from "./Script";
import { Standard } from "./Standard";
export declare class Factory {
    static standard(msg: string): Standard;
    static noSuchFileOrDirectory(path: string): NoSuchFileOrDirectory;
    static notDirectory(name: string): NotDirectory;
    static script(fileName: string, errorMessage: string): Script;
    private constructor();
}
//# sourceMappingURL=Factory.d.ts.map