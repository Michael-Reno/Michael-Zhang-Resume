// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output, deployed to Vercel with zero config.
// `site` drives canonical + Open Graph URLs. Point it at the live deployment;
// swap for a custom domain here once DNS is set up.
export default defineConfig({
  site: 'https://michael-zhang-resume-bris.vercel.app',
  vite: {
    // Cast works around a Vite version mismatch between @tailwindcss/vite and
    // Astro's bundled Vite types — runtime is unaffected.
    plugins: [/** @type {any} */ (tailwindcss())],
  },
});
