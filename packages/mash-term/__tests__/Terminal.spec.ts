import { sharedContext } from "./shared";
import { Terminal } from "../src/Terminal";

describe("Terminal", () => {
  let subject: Terminal;

  beforeEach(() => {
    const { terminal } = sharedContext.hasTerminal();
    subject = terminal;
  });

  describe("#windowStat", () => {
    it("should return correct value", () => {
      const result = subject.windowStat;
      const expected = {
        width: 0,
        height: 0,
        availableWidth: -16,
        availableHeight: -8,
      };
      expect(result).toEqual(expected);
    });
  });

  describe("#measureText", () => {
    it("should calculate", () => {
      const tests = [
        {
          text: "domo",
          width: 4
        },
      ];

      for (const t of tests) {
        const result = subject.measureText(t.text);
        expect(result.width).toEqual(t.width);
      }
    });
  });
});
