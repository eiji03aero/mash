import { FileSystem } from "mash-filesystem";
import { EditorEngine } from "./service";
import { render } from "./adapters/ui";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  if (!container) {
    throw new Error("container not found");
  }

  const filesystem = FileSystem.bootstrap();
  filesystem.installNodes(filesystem.rootDirectory.id, fixtureNodes);

  const engine = new EditorEngine({
    filesystem,
  });

  (window as any).e = engine;

  render({
    container,
    engine,
  });

  const r1 = filesystem.resolveNodeFromPath("/README.txt");
  if (r1._tag === "Left") {
    throw r1.left;
  }

  window.setTimeout(() => {
    engine.requestAction({
      type: "openBuffer",
      nodeId: r1.right.id,
    });
  }, 500);
});

const formatString = (str: string) => str.trim();

const fixtureNodes = [
  {
    name: "home",
    children: [
      {
        name: "Applications",
        children: [
          {
            name: "game.app",
            content: "game will be here",
          },
          {
            name: "vim",
            content: "vim will be here",
          },
        ]
      },
      {
        name: "Desktop",
        children: [
          {
            name: "memo.txt",
            content: "memo desu"
          },
          {
            name: "work",
            children: [
              {
                name: "todo1",
                content: "do dishes"
              },
              {
                name: "todo2",
                content: "go for shopping"
              }
            ]
          }
        ]
      },
    ]
  },
  {
    name: "README.txt",
    content: formatString(`
# mash-editor
- vim-like filesystem editor

## features
- open file in buffer
- vim-like experience
  - move cursors with key binding
  - move window focus with key binding
- save files
- will be integrated with mash and mash-filesystem and web
- chotto taihen dakedo ganbarimasyo

## Plans
- phase 1
  - support basic operations
- phase 2
  - implement advanced features
  - it is a okay to directly depend on mash-filesystem!

## Notes
- hoge
  - hoge
  - hoge
  - hoge
  - hoge
  - hoge
  - hoge
- kore
  - kore
  - kore
    - kore
  - kore
    - kore
  - kore
    - kore
    - kore
    - kore
    - kore

## Waring
- this is still
-
-
-
-
-
-
-
-
-
-
-
- in active development
    `)
  }
];
