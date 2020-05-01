import * as E from "fp-ts/es6/Either";
import { ExitStatus } from "mash";

import { CommandPayload } from "../types";

export default async ({
  environment,
  context: {
    service,
    read,
  }
}: CommandPayload) => {
  if (service.isLoggedIn) {
    environment.error(ExitStatus.Failure, "already logged in");
    return
  }

  environment.writeln("initiating signup process ...");
  const name = await read("user name: ");
  const password = await read("password: ");
  const passwordConfirmation = await read("password again: ");

  if (password !== passwordConfirmation) {
    environment.error(ExitStatus.Failure, "password and confirmation did not match");
    return;
  }

  const r1 = await service.signup({
    name: name,
    password: password,
  });
  if (E.isLeft(r1)) {
    environment.error(ExitStatus.Failure, `signup failed: ${r1.left.message}`);
    return;
  }

  environment.writeln(`signup success! ${name} ${password}`);
};
