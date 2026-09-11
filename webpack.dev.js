const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js"
  },

  mode: "development",

  output: {
    path: `${__dirname}/build`,
    filename: "app.js"
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html"
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },

      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },

      {
        test: /\.(svg|jpg|jpeg|png|ttf|eot|woff|woff2)$/,
        type: "asset"
      }
    ]
  },

  devtool: "source-map",

  watch: true
};
