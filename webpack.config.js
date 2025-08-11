const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/", // needed for react-router-dom
    clean: true // ensures fresh build
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: true
    })
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  devServer: isDev
    ? {
        historyApiFallback: true,
        static: {
          directory: path.join(__dirname, "public")
        },
        port: 3000
      }
    : undefined
};
