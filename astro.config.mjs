import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://suncycle.app',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  prefetch: {
    defaultStrategy: 'hover',
  },
  compressHTML: true,
});
