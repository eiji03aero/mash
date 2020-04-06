import { sharedContext } from "../shared";
import { CalculateService } from "../../src/services";

describe("CalculateService", () => {
  let subject: CalculateService;

  beforeEach(() => {
    const { terminal } = sharedContext.hasTerminal();
    subject = new CalculateService(terminal);
  });

  it("should have properties", () => {
    expect(subject).toHaveProperty("ctx");
  });

  describe("#measureText", () => {
    it("should measure width", () => {
      const tests = [
        {
          text: "Eiji /home $ ",
          width: 13,
        },
      ];

      for (const t of tests) {
        const result = subject.measureText(t.text);
        expect(result.width).toEqual(t.width);
      }
    });
  });
});
