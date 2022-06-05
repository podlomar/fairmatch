const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './server/index.tsx',
  mode: 'development',
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
