const webpack = require("webpack");

module.exports = function override(config, env) {
  // Add fallbacks for Node.js core modules
  config.resolve.fallback = {
    buffer: require.resolve("buffer/"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    vm: require.resolve("vm-browserify"),
    process: require.resolve("process/browser"), // Ensure correct path
  };

  // Add rule to disable "fully specified" behavior for .mjs files
  config.module.rules.unshift({
    test: /\.m?js$/,
    resolve: {
      fullySpecified: false, // Disable the "fully specified" behavior
    },
  });

  // Use ProvidePlugin to automatically load modules
  config.plugins.push(
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"], // Provide Buffer globally
      process: "process/browser", // Provide process globally
    }),
  );

  return config;
};
