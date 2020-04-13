import { FileSystem } from "mash-filesystem";
import readline from "readline";

import { Environment } from "./Environment";
import { MashClient } from "./MashClient";

const fileSystem = FileSystem.bootstrap();
const environment = new Environment({
  onWriteln: (str: string) => {
    console.log(str);
  },
});
const client = new MashClient<any>({
  environment,
  commandMap: {
    hoge: async ({ args }) => {
      console.log(args);
    },
    hogesleep: async ({ args }) => {
      await new Promise((res) => global.setTimeout(res, 1000));
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

rl.on("line", async (input: string) => {
  await client.eval(input, context);

  rl.setPrompt(getPrompt());
  rl.prompt();
});
