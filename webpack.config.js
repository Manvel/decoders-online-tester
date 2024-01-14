const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const targetFolder = path.resolve(__dirname, 'dist');
const sourceFolder = path.resolve(__dirname, 'src');

module.exports = {
  mode: 'development',
  entry: path.join(sourceFolder, "index.js"),
  output: {
    path: targetFolder,
    filename: 'main.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.join(sourceFolder, "index.html"), to: path.join(targetFolder, 'index.html') }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
