import * as Errors from './Errors';

export class ErrorFactory {
  private constructor () {}

  static noSuchFileOrDirectory (path: string) {
    return new Errors.NoSuchFileOrDirectoryError({ path });
  }

  static notDirectory (name: string) {
    return new Errors.NotDirectoryError({ name });
  }
}
