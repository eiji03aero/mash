import * as E from "fp-ts/lib/Either";
import { ExitStatus } from "mash";

import { CommandPayload } from "../types";

export default async ({
  environment,
  context: {
    service,
  }
}: CommandPayload) => {
  if (!service.isLoggedIn) {
    environment.error(ExitStatus.Failure, "not yet logged in");
    return
  }

  environment.writeln("logging out ...");

  const r1 = await service.logout();
  if (E.isLeft(r1)) {
    environment.error(ExitStatus.Failure, `logout failed: ${r1.left.message}`);
    return;
  }

  environment.writeln("logout success!");
};
