import { Standard } from './Standard';
import { NoSuchFileOrDirectory } from './NoSuchFileOrDirectory';
import { NotDirectory } from './NotDirectory';
import { Script } from './Script';
export declare class ErrorFactory {
    private constructor();
    static standard(msg: string): Standard;
    static noSuchFileOrDirectory(path: string): NoSuchFileOrDirectory;
    static notDirectory(name: string): NotDirectory;
    static script(fileName: string, errorMessage: string): Script;
}
//# sourceMappingURL=ErrorFactory.d.ts.map