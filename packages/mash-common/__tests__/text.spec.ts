import _ from "lodash";
import {
  colorNameMap,
} from "../src/types";
import * as text from "../src/text";

describe("text", () => {
  describe("getColorFromCode", () => {
    it("should get color name from code", () => {
      const tests = _.toPairs(colorNameMap);

      for (const t of tests) {
        const result = text.getColorFromCode(t[1]);
        expect(result).toEqual(t[0]);
      }
    });

    it("should get reset from invalid code", () => {
      const result = text.getColorFromCode("hoge");
      expect(result).toEqual("reset");
    });
  });

  describe("parseColorString", () => {

    it("should parse", () => {
      const tests = [
        {
          text: "domo kore desu",
          expected: [{ text: "domo kore desu", color: "reset" }],
        },
        {
          text: `root ${text.colorSequence.red}red`,
          expected: [
            { text: "root ", color: "reset" },
            { text: "red", color: "red" },
          ],
        },
        {
          text: `${text.colorSequence.blue}user ${text.colorSequence.reset}home`,
          expected: [
            { text: "user ", color: "blue" },
            { text: "home", color: "reset" },
          ],
        },
        {
          text: `Eiji's MBP ${text.colorSequence.blue}/home ${text.colorSequence.reset}$ `,
          expected: [
            { text: "Eiji's MBP ", color: "reset" },
            { text: "/home ", color: "blue" },
            { text: "$ ", color: "reset" },
          ],
        },
      ];

      for (const t of tests) {
        const result = text.parseColorString(t.text);
        for (let i = 0; i < result.length; i++) {
          expect(result[i]).toEqual(t.expected[i]);
        }
      }
    });
  });

  describe("hideCharacters", () => {
    it("should wrap with hideToken", () => {
      const tests = [
        {
          text: `${text.hideCharacters("hoge")}`,
          expected: `${text.hideToken}hoge${text.hideToken}`,
        },
      ];

      for (const t of tests) {
        expect(t.text).toEqual(t.expected);
      }
    });
  });

  describe("stripHideCharacters", () => {
    it("should strip hideToken", () => {
      const tests = [
        {
          text: `${text.hideCharacters("should not")}hoge`,
          expected: "hoge",
        },
        {
          text: `first ${text.hideCharacters("should not")}bite`,
          expected: "first bite",
        },
        {
          text: `Eiji's MBP ${text.colorSequence.blue}/home ${text.colorSequence.reset}$ `,
          expected: "Eiji's MBP /home $ ",
        },
      ];

      for (const t of tests) {
        const result = text.stripHideCharacters(t.text);
        expect(result).toEqual(t.expected);
      }
    });
  });

  describe("getColorEscapeSequence", () => {
    it.todo("should get color escape sequence with color");
  });
});
