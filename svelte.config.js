import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html', // útil para SPAs con rutas internas
    }),
    alias: {
      $components: 'src/lib/components',
      $lib: 'src/lib',
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
