import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://multimoulures.com',
  trailingSlash: 'always',
  i18n: { defaultLocale: 'fr', locales: ['fr', 'en'], routing: { prefixDefaultLocale: false } },
  // While English is not live, keep /en/ out of the sitemap (see company.englishLive in src/data/site.ts)
  integrations: [sitemap({ filter: (page) => !page.includes('/en/') })],
});
