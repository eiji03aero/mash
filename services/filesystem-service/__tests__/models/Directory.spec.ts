import { IUser } from "../../src/types";
import { Directory, File } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection("test-models-Directory");

describe("Directory", () => {
  let user: IUser;

  beforeEach(async () => {
    user = await sharedContext.hasUser();
  });

  it("can create", async () => {
    await Directory.create({ name: "hoge", ownerId: user.id });
  });

  it("can update", async () => {
    const dir = await Directory.create({ name: "hoge", ownerId: user.id });
    dir.name = "hoge2";
    await dir.save();
  });

  it("has children", async () => {
    const dir = await Directory.create({ name: "hoge", ownerId: user.id });

    const f = await File.create({ name: "domo", ownerId: user.id });
    const d = await Directory.create({ name: "domo", ownerId: user.id });
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
      const dir = await Directory.create({ name: "hoge", ownerId: user.id });
      const f = await File.create({ name: "domo", ownerId: user.id });
      const d = await Directory.create({ name: "domo", ownerId: user.id });
      dir.files.push(f);
      dir.directories.push(d);
      await dir.save();

      const rdir = await Directory.findById(dir.id);
      if (rdir === null) return;
      const serialized = rdir.serialize();
      expect(serialized.cid).toEqual(dir.id);
      expect(serialized.name).toEqual(params.name);
      expect(serialized.children.length).toEqual(2);
    })
  })
});
