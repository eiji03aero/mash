import { text } from "mash-common";
import { FileSystem } from "mash-filesystem";
import readline from "readline";

import { Environment } from "./Environment";

/* tslint:disable */
const fileSystem = FileSystem.bootstrap();
const environment = Environment.bootstrap(fileSystem);
environment.onWrite((row: text.Row) => {
  const str = row
    .map((t: text.ITextObject) => t.text)
    .join("");
  console.log(str);
});

const getPrompt = () => `mash ${fileSystem.currentDirectory.name} > `;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: getPrompt(),
});

console.log(`
Welcome to mash!
Ctl + C to finish
`);

rl.prompt();

rl.on("line", (input: string) => {
  environment.eval(input);

  rl.setPrompt(getPrompt());
  rl.prompt();
});
