import * as date from "../src/date";

describe("date", () => {
  it("should get current time", () => {
    const currentTime = date.getCurrentTime();
    const d = new Date();
    expect(currentTime).toMatch(new RegExp(d.getFullYear().toString()));
    expect(currentTime).toMatch(new RegExp((d.getMonth() + 1).toString()));
    expect(currentTime).toMatch(new RegExp(d.getDate().toString()));
  });
});
