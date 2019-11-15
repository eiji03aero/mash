import { Terminal } from './index';

document.addEventListener('DOMContentLoaded', (_: Event) => {
  const promptObj = [
    { text: "Eiji's MBP " },
    { text: "/home ", color: 'blue' },
    { text: "$ " },
  ];
  const terminal = new Terminal(
    document.querySelector('#app') as HTMLElement,
    {
      prompt: promptObj
    }
  );

  const dummy = [
    "this is not going to end well",
    "I know it was not the right timing, but I couldn't help",
    "There was this beautiful sunrise",
    "That was it",
  ];

  let count = 0;
  for (let t of dummy) {
    count += 1;
    let c = count;
    setTimeout(() => {
      terminal.writeln([...promptObj, {text: t}]);
    }, c * 100);
  }

  setTimeout(() => {
    terminal.prompt();
  }, dummy.length * 100);

  terminal.onKeyPress((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      terminal.prompt();
    }
  });
});
