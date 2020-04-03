const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  mode: "production",
  // TODO: should have production entry point
  entry: "./src/index.dev.tsx",
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.GRAPHQL_SERVER_HOST": JSON.stringify("localhost:4000"),
    }),
  ],
});
