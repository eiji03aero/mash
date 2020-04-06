import { text } from "mash-common";
import { Terminal } from "./index";

document.addEventListener("DOMContentLoaded", (_: Event) => {
  const promptStr = `Eiji's MBP ${text.colorSequence.blue}/home ${text.colorSequence.reset}$ `;
  const terminal = new Terminal(
    document.querySelector("#app") as HTMLElement,
    {
      prompt: promptStr,
    },
  );

  const dummy = [
    "this is not going to end well",
    "I know it was not the right timing, but I couldn't help",
    "There was this beautiful sunrise",
    "That was it",
  ];

  const interval = 500;
  let count = 0;
  for (const t of dummy) {
    count += 1;
    const c = count;
    setTimeout(() => {
      terminal.writeln(t);
    }, c * interval);
  }

  setTimeout(() => {
    terminal.prompt();
  }, dummy.length * interval);

  (window as any).t = terminal;

  terminal.onKeyUp((e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        terminal.prompt();
        break;
    }
  });
});
