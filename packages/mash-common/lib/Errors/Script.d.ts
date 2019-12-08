import { Base, IBaseBasis } from "./Base";
interface IScriptBasis extends IBaseBasis {
    fileName: string;
    errorMessage: string;
}
export declare class Script extends Base {
    fileName: string;
    errorMessage: string;
    constructor(params: IScriptBasis);
    message(): string;
}
export {};
//# sourceMappingURL=Script.d.ts.map