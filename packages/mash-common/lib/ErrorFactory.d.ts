import * as Errors from './Errors';
export declare class ErrorFactory {
    private constructor();
    static noSuchFileOrDirectory(path: string): Errors.NoSuchFileOrDirectory;
    static notDirectory(name: string): Errors.NotDirectory;
    static script(fileName: string, errorMessage: string): Errors.Script;
}
//# sourceMappingURL=ErrorFactory.d.ts.map