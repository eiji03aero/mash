import { File } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection("test-models-File");

describe("File", () => {
  it("can create", async () => {
    await File.create({ name: "hoge", content: "test" });
  });

  it("can update", async () => {
    const file = await File.create({ name: "hoge", content: "test" });
    file.name = "hoge2";
    await file.save();
  });
});
