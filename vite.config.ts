import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  // Base configuration shared between dev and build
  const baseConfig = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };

  // Dev mode: run as a regular app
  if (command === 'serve') {
    return baseConfig;
  }

  // Build mode: library configuration
  return {
    ...baseConfig,
    plugins: [
      ...baseConfig.plugins,
      dts({
        include: ['src/**/*'],
        exclude: ['src/**/*.stories.tsx', 'src/**/*.test.tsx'],
        rollupTypes: true,
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'CEFRReportUI',
        formats: ['es'],
        fileName: 'index',
      },
      rollupOptions: {
        external: [
          'react',
          'react-dom',
          'react/jsx-runtime',
          '@radix-ui/react-tabs',
          '@radix-ui/react-scroll-area',
          '@radix-ui/react-slider',
          '@radix-ui/react-checkbox',
          '@radix-ui/react-label',
          '@radix-ui/react-tooltip',
          '@radix-ui/react-slot',
        ],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
      sourcemap: true,
      cssCodeSplit: false,
    },
  };
});
