const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  externals: [nodeExternals()],
  entry: ['./src/clientEntry.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      { // fixes https://github.com/graphql/graphql-js/issues/1272
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/build',
    filename: 'main.js',
    publicPath: '/public/',
    library: 'app',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    })
  ],
};
