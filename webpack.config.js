const path = require('path');
const name = 'index';

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', "index.js"),
  output: {
    path: path.join(__dirname, 'build'),
    filename: name+'.js'
  },
  devServer: {
    contentBase: [path.join(process.cwd(), 'build')],
    compress: true,
    port: 3000
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: {
                    browsers: ['last 3 versions']
                  }
                }
              ]
            ]
          }
        }
      }
    ]
  }
};
