// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output, deployed to Vercel with zero config.
// Update `site` to the production domain once DNS is set (used for canonical + OG URLs).
export default defineConfig({
  site: 'https://michael-zhang.dev',
  vite: {
    // Cast works around a Vite version mismatch between @tailwindcss/vite and
    // Astro's bundled Vite types — runtime is unaffected.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
