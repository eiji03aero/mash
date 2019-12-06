import { Either, EitherLeft, EitherRight } from '../types';
import * as Errors from '../Errors';
export declare const either: {
    left(err: Errors.Base): EitherLeft;
    right<T = any>(value: T): EitherRight<T>;
    isLeft(e: Either<any>): e is EitherLeft;
    isRight<T_1 = any>(e: Either<any>): e is EitherRight<T_1>;
};
//# sourceMappingURL=either.d.ts.map