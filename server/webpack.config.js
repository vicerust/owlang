const path = require('path');

  module.exports = {
    entry: './src/server.ts',
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
	},
	node: { fs: 'empty', net:'empty', child_process: 'empty' },
  };