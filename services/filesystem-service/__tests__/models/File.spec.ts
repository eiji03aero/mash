import { ISystemProfile } from "../../src/types";
import { File } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection();

describe("File", () => {
  let systemProfile: ISystemProfile;

  beforeEach(async () => {
    systemProfile = await sharedContext.hasSystemProfile();
  });

  it("can create", async () => {
    await File.create({ name: "hoge", content: "test", ownerId: systemProfile.id });
  });

  it("can update", async () => {
    const file = await File.create({ name: "hoge", content: "test", ownerId: systemProfile.id });
    file.name = "hoge2";
    await file.save();
  });

  describe("#serialize", () => {
    it("works", async () => {
      const params = { name: "hoge", content: "content", ownerId: systemProfile.id };
      const file = await File.create(params);
      const serialized = file.serialize();
      expect(serialized.id).toBeDefined();
      expect(serialized.name).toEqual(params.name);
      expect(serialized.content).toEqual(params.content);
    });
  });
});
