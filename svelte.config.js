import { vitePreprocess } from "@astrojs/svelte";

export default {
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  preprocess: [vitePreprocess({ script: true })],
};
