import { defineConfig } from "vite";

export default defineConfig({
  base: "./", // 상대 경로를 사용해 index.html 파일이 제대로 동작하도록 설정
  build: {
    outDir: "dist", // 빌드된 파일이 dist 디렉토리에 저장
    assetsDir: "assets", // CSS, JS와 같은 자산이 저장될 디렉토리
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]", // 자산 파일의 이름을 빌드된 파일로 지정
      },
    },
  },
});
