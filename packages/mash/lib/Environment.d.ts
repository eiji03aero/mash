import { text } from 'mash-common';
import { IFileSystem } from 'mash-filesystem';
import { IEnvironment, ExitStatus, EnvironmentWriteHandler } from './types';
export declare class Environment implements IEnvironment {
    private _fileSystem;
    private static _instance;
    private _exitStatus;
    private _environmentWriteHandler;
    static bootstrap(fs: IFileSystem): IEnvironment;
    static get instance(): IEnvironment;
    private constructor();
    get exitStatus(): ExitStatus;
    eval(str: string): void;
    error(code: ExitStatus, message?: string): void;
    writeln(row: text.Row): void;
    onWrite(func: EnvironmentWriteHandler): void;
    private _resetEnvironment;
}
//# sourceMappingURL=Environment.d.ts.map