/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname =
  typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const externalReactIds = new Set([
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',
]);
const isExternalReactRuntime = (id) =>
  externalReactIds.has(id) ||
  id.includes('react-jsx-runtime') ||
  id.includes('react-jsx-dev-runtime');
const addUseClientDirective = () => ({
  name: 'add-use-client-directive',
  generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type !== 'chunk') continue;
      if (!asset.fileName.startsWith('8bit-ui')) continue;
      if (asset.code.startsWith("'use client';") || asset.code.startsWith('"use client";')) {
        continue;
      }

      asset.code = `'use client';\n${asset.code}`;
    }
  },
});

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: '8BitUI',
      fileName: '8bit-ui',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: isExternalReactRuntime,
      plugins: [addUseClientDirective()],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'react/jsx-dev-runtime': 'jsxDevRuntime',
        },
      },
    },
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          setupFiles: ['.storybook/vitest.setup.js'],
        },
      },
    ],
  },
});
