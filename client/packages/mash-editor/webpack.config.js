const HtmlWebpackPlugin = require("html-webpack-plugin");

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
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".mjs", ".js", "jsx", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
};
