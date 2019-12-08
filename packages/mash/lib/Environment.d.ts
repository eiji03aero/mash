import { text } from "mash-common";
import { IFileSystem } from "mash-filesystem";
import { EnvironmentWriteHandler, ExitStatus, IEnvironment } from "./types";
export declare class Environment implements IEnvironment {
    private _fileSystem;
    static get instance(): IEnvironment;
    get exitStatus(): ExitStatus;
    static bootstrap(fs: IFileSystem): IEnvironment;
    private static _instance;
    private _exitStatus;
    private _environmentWriteHandler;
    private constructor();
    eval(str: string): void;
    error(code: ExitStatus, message?: string): void;
    writeln(row: text.Row): void;
    onWrite(func: EnvironmentWriteHandler): void;
    private _resetEnvironment;
}
//# sourceMappingURL=Environment.d.ts.map