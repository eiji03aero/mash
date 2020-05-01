import * as E from "fp-ts/lib/Either";
import { ExitStatus } from "mash";

import { CommandPayload } from "../types";
import * as session from "../../../adapters/session";

export default async ({
  environment,
  context: {
    service,
  }
}: CommandPayload) => {
  const token = session.getToken();
  if (!token) {
    environment.error(ExitStatus.Failure, "not logged in yet");
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
