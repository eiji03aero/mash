import { Directory, File } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection("test-models-Directory");

describe("Directory", () => {
  it("can create", async () => {
    await Directory.create({ name: "hoge" });
  });

  it("can update", async () => {
    const dir = await Directory.create({ name: "hoge" });
    dir.name = "hoge2";
    await dir.save();
  });

  it("has children", async () => {
    const dir = await Directory.create({ name: "hoge" });

    const f = await File.create({ name: "domo" });
    const d = await Directory.create({ name: "domo" });
    dir.files.push(f);
    dir.directories.push(d);
    await dir.save();

    const rdir = await Directory.findById(dir.id);
    if (rdir === null) return;
    expect(rdir.files.length).toEqual(1);
    expect(rdir.directories.length).toEqual(1);
  });
});
