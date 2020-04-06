import { FileSystem } from "mash-filesystem";
import readline from "readline";

import { Environment } from "./Environment";
import { MashClient } from "./MashClient";

/* tslint:disable */
const fileSystem = FileSystem.bootstrap();
const environment = new Environment({
  onWriteln: (str: string) => {
    console.log(str);
  },
});
const client = new MashClient<any>({
  environment,
  commandMap: {
    hoge: ({ args }) => {
      console.log(args);
    },
  },
});
const context = {} as any;


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
  client.eval(input, context);

  rl.setPrompt(getPrompt());
  rl.prompt();
});
