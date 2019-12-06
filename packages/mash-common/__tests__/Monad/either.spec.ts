import { Monad, Errors } from '../../src';
import { Either } from '../../src/types';

describe('Monad.either', () => {
  describe('.left', () => {
    it('should return EitherLeft', () => {
      const result = Monad.either.left(Errors.Factory.standard('error'));
      expect(result.isError).toBeTruthy();
      expect(result.error).toBeInstanceOf(Errors.Base);
    });
  });

  describe('.right', () => {
    it('should return EitherRight', () => {
      const value = 'hoge'
      const result = Monad.either.right<string>(value);
      expect(result.isError).toBeFalsy();
      expect(result.value).toEqual(value);
    });
  });

  describe('implementation', () => {
    const subject = (num: number): Either => {
      if (num < 5) {
        return Monad.either.left(Errors.Factory.standard('too small'));
      }
      return Monad.either.right<number>(num);
    };

    it('should return EitherLeft', () => {
      const result = subject(3);
      expect(result.isError).toBeTruthy();
      if (result.isError) {
        expect(result.error).toBeInstanceOf(Errors.Base);
      }
    });

    it('should return EitherLeft', () => {
      const result = subject(10);
      expect(result.isError).toBeFalsy();
      // if (Monad.either.isRight(result)) {
      if (Monad.either.isRight(result)) {
        // testing guard function by accessing value property
        // somehow looking up isError property to false in if condition
        // does not narrowing the type for inference
        expect(result.value).toEqual(10);
      }
    })
  });
});
