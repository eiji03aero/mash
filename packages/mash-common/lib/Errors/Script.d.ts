import { Base, BaseBasis } from "./Base";
interface ScriptBasis extends BaseBasis {
    fileName: string;
    errorMessage: string;
}
export declare class Script extends Base {
    fileName: string;
    errorMessage: string;
    constructor(params: ScriptBasis);
    message(): string;
}
export {};
//# sourceMappingURL=Script.d.ts.map