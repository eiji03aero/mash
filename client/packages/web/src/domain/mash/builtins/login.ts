import * as E from "fp-ts/lib/Either";
import { ExitStatus } from "mash";

import { CommandPayload } from "../types";
import * as session from "../../../adapters/session";

export default async ({
  environment,
  context: {
    proxy,
    read,
  }
}: CommandPayload) => {
  // TODO: should return if already signed in

  environment.writeln("logging you in ...");
  const name = await read("user name: ");
  const password = await read("password: ");

  const r1 = await proxy.login({
    name: name,
    password: password,
  });
  if (E.isLeft(r1)) {
    environment.error(ExitStatus.Failure, `signup failed: ${r1.left.message}`);
    return;
  }

  session.setToken(r1.right);
  environment.writeln(`signup success! ${name} ${password} ${r1.right}`);
};
