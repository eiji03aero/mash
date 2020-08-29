import * as E from "fp-ts/lib/Either";
import { ExitStatus } from "mash";

import { CommandPayload } from "../types";

export default async ({
  environment,
  context: {
    service,
    read,
  }
}: CommandPayload): Promise<void> => {
  if (service.isLoggedIn) {
    environment.error(ExitStatus.Failure, "already logged in");
    return
  }

  environment.writeln("logging you in ...");
  const name = await read("user name: ");
  const password = await read("password: ");

  const r1 = await service.login({
    name: name,
    password: password,
  });
  if (E.isLeft(r1)) {
    environment.error(ExitStatus.Failure, `login failed: ${r1.left.message}`);
    return;
  }

  environment.writeln(`login success! ${name} ${password} ${r1.right}`);
};
