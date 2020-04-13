import { ExitStatus } from "mash";
import { Monad } from "mash-common";

import { CommandPayload } from "../types";

export default async ({
  environment,
  context: {
    proxy,
    read,
  }
}: CommandPayload) => {
  // TODO: should return if already signed in

  environment.writeln("Welcome to mash! Initiating signup process ...");
  const name = await read("Your name: ");
  const password = await read("Password: ");
  const passwordConfirmation = await read("Password again: ");

  if (password !== passwordConfirmation) {
    environment.error(ExitStatus.Failure, "password and confirmation did not match");
    return;
  }

  const r1 = await proxy.signup({
    name: name,
    password: password,
  });
  if (Monad.either.isLeft(r1)) {
    environment.error(ExitStatus.Failure, `signup failed: ${r1.error.message()}`);
    return;
  }

  console.log(r1.value);
  environment.writeln(`signup success! ${name} ${password}`);
};
