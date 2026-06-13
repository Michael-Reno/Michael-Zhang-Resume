// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output, deployed to Vercel with zero config.
// Using localhost for now (used for canonical + OG URLs); switch `site` to the
// production domain once DNS is set up.
export default defineConfig({
  site: 'http://localhost:4321',
  vite: {
    // Cast works around a Vite version mismatch between @tailwindcss/vite and
    // Astro's bundled Vite types — runtime is unaffected.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
