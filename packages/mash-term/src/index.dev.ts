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

  terminal.prompt();
});
