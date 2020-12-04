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
    content: require("!raw-loader!../README.md").default,
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
