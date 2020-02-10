export const fixtureNodes = [
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
    content: "warnings aqui"
  }
];
