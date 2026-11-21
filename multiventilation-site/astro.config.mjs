import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://multiventilation.ca',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !/\/(en\/)?pro\//.test(page) })],
});
