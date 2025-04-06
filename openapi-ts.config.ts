import { defineConfig } from '@hey-api/openapi-ts';
import { defaultPlugins } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'src/v1-openapi.json',
  output: 'src/client',
  plugins: [
    ...defaultPlugins,
    '@hey-api/client-axios',
    'zod',
    {
      name: '@hey-api/sdk',
      asClass: false,
      validator: true,
    },
  ],
});
