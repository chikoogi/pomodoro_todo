import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import { fileURLToPath } from "url";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: "./src/scripts/main.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/, // .css 파일을 처리
        use: ["style-loader", "css-loader"], // 로더 설정
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // webpack 5의 방식: 파일을 자동으로 resource로 취급하여 복사
        generator: {
          filename: "images/[name][ext]", // 빌드 시 이미지 파일의 경로와 이름 형식 지정
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|pages)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  mode: process.env.NODE_ENV,
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html", // 사용할 HTML 템플릿 파일
    }),
    new CopyPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3501,
    hot: true,
  },
};
