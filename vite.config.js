import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";

export default defineConfig({
  base: "./",
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "src/assets/icon/*",
          dest: "assets/icon",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        format: "cjs", // CommonJS 형식으로 설정
        entryFileNames: "[name].js", // 파일 이름 설정
        chunkFileNames: "[name].js", // 청크 파일 이름 설정
        assetFileNames: "[name].[ext]", // 자산 파일 이름 설정
      },
    },
  },
});
