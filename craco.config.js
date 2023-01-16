module.exports = {
  webpack: {
    configure: webpackConfig => {
      webpackConfig.resolve.fallback = {
        fs: false,
      }
      return webpackConfig;
    },
  },
};