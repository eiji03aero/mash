import * as paths from '../src/paths';

describe('paths', () => {
  describe('basename', () => {
    it('should return basename', () => {
      const tests = [
        ['domo/hoge', 'hoge'],
        ['hoge', 'hoge'],
        ['/root/home/app.ts', 'app.ts']
      ];

      for (let t of tests) {
        const result = paths.basename(t[0]);
        expect(result).toEqual(t[1]);
      }
    });
  });

  describe('dirname', () => {
    it('should return directory name', () => {
      const tests = [
        ['domo/hoge', 'domo'],
        ['hoge', '.'],
        ['/root/home/app.ts', '/root/home']
      ];

      for (let t of tests) {
        const result = paths.dirname(t[0]);
        expect(result).toEqual(t[1]);
      }
    });
  });
});
