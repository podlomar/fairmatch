import path from 'path';
import { fileURLToPath } from "url";
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serverConfig = {
  entry: './src/server/index.tsx',
  mode: 'development',
  target: 'es2021',
  devtool: false,
  output: {
    path: path.resolve('./dist'),
    filename: 'server.js',
    publicPath: '/',
    module: true,
    chunkFormat: 'module',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/server'), 
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  externals: [
    nodeExternals({
      importType: 'module',
    }),
  ],
  externalsPresets: { node: true },
  experiments: {
    outputModule: true,
  },
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
      {
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          // {
          //   loader: 'sass-resources-loader',
          //   options: {
          //     resources: [
          //       'src/server/resources/vars.scss',
          //       'src/server/resources/mixins.scss',
          //     ],
          //   },
          // },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/style.css',
    }),
  ]
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
      filename: 'stats.json',
      transform(data) {
        return JSON.stringify({
          bundle: data.assetsByChunkName.main[0],
        }, null, 2);
      },
    }),
  ],
};

export default [clientConfig, serverConfig];
