const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  mode: "development",
  entry: "./src/index.dev.tsx",
  output: {
    path: `${__dirname}/lib`,
    filename: "index.dev.js",
  },
  devServer: {
    inline: true,
    progress: true,
    contentBase: `${__dirname}/lib`,
    watchContentBase: true,
    host: '0.0.0.0',
    port: 8090,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.GRAPHQL_SERVER_HOST": JSON.stringify("localhost:4000"),
    }),
  ],
});
