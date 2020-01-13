import { IUser } from "../../src/types";
import { File } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection("test-models-File");

describe("File", () => {
  let user: IUser;

  beforeEach(async () => {
    user = await sharedContext.hasUser();
  });

  it("can create", async () => {
    await File.create({ name: "hoge", content: "test", ownerId: user.id });
  });

  it("can update", async () => {
    const file = await File.create({ name: "hoge", content: "test", ownerId: user.id });
    file.name = "hoge2";
    await file.save();
  });

  describe("#serialize", () => {
    it("works", async () => {
      const params = { name: "hoge", content: "content", ownerId: user.id };
      const file = await File.create(params);
      const serialized = file.serialize();
      expect(serialized.cid).toBeDefined();
      expect(serialized.name).toEqual(params.name);
      expect(serialized.content).toEqual(params.content);
    });
  });
});
