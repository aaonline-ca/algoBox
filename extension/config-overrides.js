/* config-overrides.js */

const path = require("path");
const webpack = require("webpack");

module.exports = function override(config, env) {
  // do stuff with the webpack config...

  config.devtool = "";
  config.entry = {
    main: config.entry[0],
    background: path.resolve(__dirname, "src/background/background.js")
  };

  if (config.mode === "production") {
    config.output.filename = "static/js/[name].js";
    config.output.chunkFilename = "static/js/[name].chunk.js";

    config.plugins[4].options.filename = "static/css/[name].css";
    config.plugins[4].options.chunkFilename = "static/css/[name].chunk.css";
  }

  // config.module.rules[2].oneOf.unshift({
  //   test: /fa-(.*)\.(ttf)$/,
  //   loader: 'ignore-loader',
  //   enforce: 'pre',
  // });

  config.optimization.runtimeChunk = false;
  config.optimization.splitChunks = {
    cacheGroups: {
      styles: {
        name: "styles",
        test: /\.css$/,
        chunks: "all",
        enforce: true
      }
    }
  };

  config.plugins.push(
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  );

  return config;
};
