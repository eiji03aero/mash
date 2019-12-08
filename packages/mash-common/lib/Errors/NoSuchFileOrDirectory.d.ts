import { Base, IBaseBasis } from "./Base";
interface INoSuchFileOrDirectoryBasis extends IBaseBasis {
    path: string;
}
export declare class NoSuchFileOrDirectory extends Base {
    path: string;
    constructor(params: INoSuchFileOrDirectoryBasis);
    message(): string;
}
export {};
//# sourceMappingURL=NoSuchFileOrDirectory.d.ts.map