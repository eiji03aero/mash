import { Base, IBaseBasis } from "./Base";
interface IStandardBasis extends IBaseBasis {
    msg: string;
}
export declare class Standard extends Base {
    msg: string;
    constructor(params: IStandardBasis);
    message(): string;
}
export {};
//# sourceMappingURL=Standard.d.ts.map