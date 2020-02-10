import * as utils from "../src/utils";

describe("utils", () => {
  describe("parseCommandArgs", () => {
    it("works", () => {
      const tests = [
        {
          input: ["cd", "./App"],
          defaultOptions: { r: false },
          expected: { args: ["cd", "./App"], options: { r: false } },
        },
        {
          input: ["rm", "-r", "./App"],
          defaultOptions: { r: false },
          expected: { args: ["rm", "./App"], options: { r: true } },
        },
      ];

      for (const t of tests) {
        const result = utils.parseCommandArgs(t.input, t.defaultOptions);
        expect(result).toEqual(t.expected);
      }
    });
  });
});
