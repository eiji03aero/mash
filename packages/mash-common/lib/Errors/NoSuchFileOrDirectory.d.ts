import { Base, BaseBasis } from "./Base";
interface NoSuchFileOrDirectoryBasis extends BaseBasis {
    path: string;
}
export declare class NoSuchFileOrDirectory extends Base {
    path: string;
    constructor(params: NoSuchFileOrDirectoryBasis);
    message(): string;
}
export {};
//# sourceMappingURL=NoSuchFileOrDirectory.d.ts.map