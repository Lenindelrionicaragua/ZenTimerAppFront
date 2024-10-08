const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer")
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== "svg"),
    sourceExts: [
      ...resolver.sourceExts,
      "svg",
      "js",
      "json",
      "ts",
      "tsx",
      "jsx",
      "cjs"
    ]
  };

  return config;
})();
