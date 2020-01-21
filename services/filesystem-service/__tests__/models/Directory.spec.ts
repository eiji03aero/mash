import { ISystemProfile } from "../../src/types";
import { Directory, File } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection("test-models-Directory");

describe("Directory", () => {
  let systemProfile: ISystemProfile;

  beforeEach(async () => {
    systemProfile = await sharedContext.hasSystemProfile();
  });

  it("can create", async () => {
    await Directory.create({ name: "hoge", ownerId: systemProfile.id });
  });

  it("can update", async () => {
    const dir = await Directory.create({ name: "hoge", ownerId: systemProfile.id });
    dir.name = "hoge2";
    await dir.save();
  });

  it("has children", async () => {
    const dir = await Directory.create({ name: "hoge", ownerId: systemProfile.id });

    const f = await File.create({ name: "domo", ownerId: systemProfile.id });
    const d = await Directory.create({ name: "domo", ownerId: systemProfile.id });
    dir.files.push(f);
    dir.directories.push(d);
    await dir.save();

    const rdir = await Directory.findById(dir.id);
    if (rdir === null) return;
    expect(rdir.files.length).toEqual(1);
    expect(rdir.directories.length).toEqual(1);
  });

  describe("#serialize", () => {
    it("works", async () => {
      const params = { name: "hoge" };
      const dir = await Directory.create({ name: "hoge", ownerId: systemProfile.id });
      const f = await File.create({ name: "domo", ownerId: systemProfile.id });
      const d = await Directory.create({ name: "domo", ownerId: systemProfile.id });
      dir.files.push(f);
      dir.directories.push(d);
      await dir.save();

      const rdir = await Directory.findById(dir.id);
      if (rdir === null) return;
      const serialized = rdir.serialize();
      expect(serialized.id).toEqual(dir.id);
      expect(serialized.name).toEqual(params.name);
      expect(serialized.children.length).toEqual(2);
    })
  })
});
