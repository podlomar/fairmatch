const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const json5 = require('json5');

const serverConfig = {
  entry: './src/server/index.tsx',
  mode: 'development',
  target: 'node',
  devtool: false,
  output: {
    path: path.resolve('./dist'),
    filename: 'server.js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/server'), 
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [
    nodeExternals(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            onlyCompileBundledFiles: true,
          },
        },
      },
    ],
  },
};

const clientConfig = {
  entry: './src/client/index.tsx',
  mode: 'development',
  output: {
    path: path.resolve('./dist'),
    filename: 'js/bundle-[contenthash:6].js',
    publicPath: '/',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/client'), 
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        ],
      },
      {
        test: /\.(scss|png|jpe?g|svg)$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new StatsWriterPlugin({
      filename: 'stats.json5',
      transform(data) {
        return json5.stringify({
          bundle: data.assetsByChunkName.main[0],
        }, null, 2);
      },
    }),
  ],
};

module.exports = [clientConfig, serverConfig];
