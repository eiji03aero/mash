import { Base, BaseBasis } from "./Base";
interface NotDirectoryBasis extends BaseBasis {
    name: string;
}
export declare class NotDirectory extends Base {
    name: string;
    constructor(params: NotDirectoryBasis);
    message(): string;
}
export {};
//# sourceMappingURL=NotDirectory.d.ts.map