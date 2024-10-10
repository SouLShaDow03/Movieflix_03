"use strict";

var webpack = require("webpack");

module.exports = {
  webpack: {
    configure: function configure(webpackConfig) {
      webpackConfig.resolve.fallback = {
        process: require.resolve("process/browser"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/"),
        path: require.resolve("path-browserify") // Add other fallbacks if necessary

      }; // Add plugins if needed

      webpackConfig.plugins = (webpackConfig.plugins || []).concat([new webpack.ProvidePlugin({
        process: "process/browser",
        Buffer: ["buffer", "Buffer"]
      })]);
      return webpackConfig;
    }
  }
};