import { Terminal } from './index';

document.addEventListener('DOMContentLoaded', (_: Event) => {
  const terminal = new Terminal(
    document.querySelector('#app') as HTMLElement,
    {
      prompt: [
        { text: "Eiji's MBP $ " },
      ]
    }
  );

  terminal.onKeyPress((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      terminal.prompt();
    }
  });
  terminal.prompt();
});
