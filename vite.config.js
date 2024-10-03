import { defineConfig } from 'vite';

export default defineConfig({
    base: './', // 상대 경로를 사용해 index.html 파일이 제대로 동작하도록 설정
    build: {
        outDir: 'dist', // 빌드된 파일이 dist 디렉토리에 저장
    },
});