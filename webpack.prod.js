const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/js/index.js"
  },

  mode: "production",

  optimization: {
    minimize: true,
    minimizer: [
      "...",
      new CssMinimizerPlugin()
    ]
  },

  performance: {
    hints: false
  },

  output: {
    // Same deployment idea as your Silksong project:
    // GitHub Pages can publish directly from /docs.
    path: `${__dirname}/docs`,
    filename: "app.js",
    assetModuleFilename: "img/[hash][ext][query]"
  },

  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: "main.css"
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      chunks: ["index"],
      filename: "index.html",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyJS: true,
        minifyCSS: true
      }
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
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      },

      {
        test: /\.(svg|jpg|jpeg|png|ttf|eot|woff|woff2)$/,
        type: "asset"
      }
    ]
  },

  devtool: "source-map"
};
