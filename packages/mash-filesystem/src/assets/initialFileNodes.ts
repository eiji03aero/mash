import { Directory } from "../Directory";
import { File } from "../File";

export const homeDirectory = new Directory({
  name: "home",
  children: [
    new Directory({
      name: "Applications",
      children: [
        new File({
          name: "game.txt",
          content: "game is here",
        }),
        new File({
          name: "editor.txt",
          content: "editor will be here",
        }),
      ],
    }),
    new Directory({
      name: "Desktop",
      children: [
        new File({
          name: "memo.txt",
          content: "do some study",
        }),
        new Directory({
          name: "work",
          children: [
            new File({
              name: "todos",
              content: "send an email",
            }),
            new File({
              name: "stats.excel",
              content: "name,domo,kore,",
            }),
          ],
        }),
      ],
    }),
    new File({
      name: "README.txt",
      content: "read me here man",
    }),
    new File({
      name: "todo.txt",
      content: "do it man",
    }),
    new File({
      name: "site-policy",
      content: "there is no such thing as policy man",
    }),
  ],
});

const varDirectory = new Directory({
  name: "var",
  children: [
    new File({
      name: "error.log",
      content: "your error is here",
    }),
  ],
});

const etcDirectory = new Directory({
  name: "etc",
  children: [
    new File({
      name: "null",
      content: "null file is here",
    }),
  ],
});

export const initialFileNodes = [
  varDirectory,
  homeDirectory,
  etcDirectory,
];
