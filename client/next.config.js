const cssLoaderConfig = require('@zeit/next-css/css-loader-config');

const withConfig = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0 https://err.sh/next-plugins/upgrade'
        );
      }

      const { dev, isServer } = options;
      const { cssModules, cssLoaderOptions, postcssLoaderOptions } = nextConfig;

      options.defaultLoaders.css = cssLoaderConfig(config, {
        extensions: ['css'],
        cssModules,
        cssLoaderOptions,
        postcssLoaderOptions,
        dev,
        isServer,
      });

      config.module.rules.push({
        test: /\.css$/,
        exclude: /node_modules/,
        use: options.defaultLoaders.css,
      });

      // cssModules: false
      config.module.rules.push({
        test: /\.css$/,
        include: /node_modules/,
        use: cssLoaderConfig(config, {
          extensions: ['css'],
          cssModules: false,
          cssLoaderOptions,
          postcssLoaderOptions,
          dev,
          isServer,
        }),
      });

      config.module.rules.push({
        test: /\.(ttf|eot|svg)$/,
        loader: 'file-loader',
      });
      config.module.rules.push({
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
      });

      config.resolve.alias['@'] = __dirname;

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
};

module.exports = withConfig({
  cssModules: true,
});
