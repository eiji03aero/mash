import mongoose from "mongoose";
import { SystemProfile } from "../../src/models";
import { sharedContext } from "../shared";

sharedContext.hasDbConnection();

describe("SystemProfile", () => {
  it("can create", async () => {
    const ownerId = mongoose.Types.ObjectId();
    const systemProfile = new SystemProfile({ ownerId });
    expect(systemProfile).not.toBeInstanceOf(Error);
    expect(systemProfile.ownerId).toEqual(ownerId);
  });
});
