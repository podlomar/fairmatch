import path from 'path';
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './client/index.tsx',
  mode: 'development',
  output: {
    path: path.resolve('./dist/public'),
    filename: 'js/bundle-[contenthash:6].js',
    publicPath: '/',
    assetModuleFilename: 'img/[name]-[hash:6].[ext]',
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'client'), 
      path.resolve(__dirname, '../node_modules')
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
        test: /\.s?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/style.css',
    }),
  ],
};
