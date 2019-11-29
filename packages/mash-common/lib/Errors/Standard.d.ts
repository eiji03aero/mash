import { Base, BaseBasis } from "./Base";
interface StandardBasis extends BaseBasis {
    msg: string;
}
export declare class Standard extends Base {
    msg: string;
    constructor(params: StandardBasis);
    message(): string;
}
export {};
//# sourceMappingURL=Standard.d.ts.map