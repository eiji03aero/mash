const webpack = require("webpack");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/index.dev.tsx",
  devServer: {
    inline: true,
    progress: true,
    contentBase: `${__dirname}/dist`,
    watchContentBase: true,
    host: '0.0.0.0',
    port: 8000,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.GRAPHQL_SERVER_HTTP_URL": JSON.stringify("http://localhost:4000/graphql"),
      "process.env.GRAPHQL_SERVER_WS_URL": JSON.stringify("ws://localhost:4000/graphql"),
    }),
  ],
});
