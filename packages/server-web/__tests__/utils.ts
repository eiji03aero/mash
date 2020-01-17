import { encodeString, compareEncodedStrings } from "../src/utils";

describe("utils", () => {
  describe("encodeString", () => {
    it("encodes string", async () => {
      const str = "hogehoge123";
      const result = encodeString(str);
      expect(result).not.toEqual(str);
    });
  });

  describe("compareEncodedStrings", () => {
    it("returns true if from same string", async () => {
      const str = "hogehoge123";
      const encoded = await encodeString(str);
      const result = await compareEncodedStrings(str, encoded);
      expect(result).toBeTruthy();
    });

    it("returns false if from different string", async () => {
      const str = "hogehoge123";
      const str2 = "domodesu";

      const encoded = await encodeString(str);
      const result = await compareEncodedStrings(str2, encoded);
      expect(result).toBeFalsy();
    });
  });
});
