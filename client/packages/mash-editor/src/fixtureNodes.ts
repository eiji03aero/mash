const formatString = (str: string) => str.trim();

export const fixtureNodes = [
  {
    name: "bin",
    children: [
      {
        name: "echo",
        content: "echo dayo",
      },
      {
        name: "puts",
        content: "puts dayo",
      },
      {
        name: "ls",
        content: "ls dayo",
      },
    ],
  },
  {
    name: "etc",
    children: [
      {
        name: "config",
        content: "config dayo"
      },
      {
        name: "ppp",
        content: "ppp aqui",
      },
      {
        name: "zshrc",
        content: "zshrc aqui",
      },
    ]
  },
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
      {
        name: "memo.txt",
        content: formatString(`
This will be a last piece of memo.
It was a freezing day, when I grasped a shadow of hokai.
They are part of immune system of the earth, which destroys civilization to protect itself.
Humanity has always lost in a war with hokai, until they founded a institution so-called tenmei.
        `)
      },
      {
        name: "identification",
        content: formatString(`
          I ain't gonna leak my precious name just because!
        `)
      }
    ]
  },
  {
    name: "var",
    children: [
      {
        name: "app.log",
        content: "app no log",
      },
      {
        name: "game.log",
        content: "game no log",
      },
      {
        name: "dev.log",
        content: "dev no log",
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
- This will be a long line since I will have to make sure all the lines have underlined even if it gets broken into multiple

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
  },
  {
    name: "lista_de_comprar.txt",
    content: formatString(`
mi esposa me pidio que comprara estas cosas.
- leche
- carne
- sal
    `)
  }
];
