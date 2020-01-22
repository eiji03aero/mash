module.exports = {
  mode: "development",
  entry: "./src/index.dev.ts",
  output: {
    path: `${__dirname}/lib`,
    filename: "index.dev.js",
  },
  devServer: {
    inline: true,
    progress: true,
    contentBase: `${__dirname}/public`,
    watchContentBase: true,
    host: '0.0.0.0',
    port: 8081,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts"]
  }
};
