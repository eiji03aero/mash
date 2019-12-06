import * as Errors from './Errors';
export declare type EitherLeft = {
    isError: true;
    error: Errors.Base;
};
export declare type EitherRight<T = any> = {
    isError: false;
    value: T;
};
export declare type Either<T = any> = EitherLeft | EitherRight<T>;
//# sourceMappingURL=types.d.ts.map