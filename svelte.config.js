import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  kit: {
    adapter: adapter({
      // Las páginas se pre-renderizan (index.html, privacidad.html…). El respaldo
      // va en 404.html: no pisa la home y nginx lo sirve con status 404.
      fallback: '404.html',
    }),
    alias: {
      $components: 'src/lib/components',
      $lib: 'src/lib',
    },
  },
  preprocess: vitePreprocess(),
};

export default config;
