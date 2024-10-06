import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
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
  /*  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "src/assets/icon/!*",
      },
    ],
  },*/
});
