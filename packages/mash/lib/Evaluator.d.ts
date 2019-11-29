import { IFileSystem } from 'mash-filesystem';
import { IAstNode, IEvaluator, IEnvironment } from './types';
export declare class Evaluator implements IEvaluator {
    private _fileSystem;
    private _environment;
    constructor(fs: IFileSystem, env: IEnvironment);
    eval(node: IAstNode): void;
    private _evalProgram;
    private _evalCommandLine;
}
//# sourceMappingURL=Evaluator.d.ts.map