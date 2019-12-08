import { Base, IBaseBasis } from "./Base";
interface INotDirectoryBasis extends IBaseBasis {
    name: string;
}
export declare class NotDirectory extends Base {
    name: string;
    constructor(params: INotDirectoryBasis);
    message(): string;
}
export {};
//# sourceMappingURL=NotDirectory.d.ts.map