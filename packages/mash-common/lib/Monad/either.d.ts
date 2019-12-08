import * as Errors from "../Errors";
import { Either, IEitherLeft, IEitherRight } from "../types";
export declare const either: {
    left(err: Errors.Base): IEitherLeft;
    right<T = any>(value: T): IEitherRight<T>;
    isLeft(e: Either<any>): e is IEitherLeft;
    isRight<T_1 = any>(e: Either<any>): e is IEitherRight<T_1>;
};
//# sourceMappingURL=either.d.ts.map