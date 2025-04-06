import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: true,
  treeshake: true,
  splitting: true,
  esbuildOptions(options) {
    options.banner = {
      js: '// Firecrawl Simple Client - https://github.com/firecrawl/firecrawl-simple-client',
    };
  },
});
