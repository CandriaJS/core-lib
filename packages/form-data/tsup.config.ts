import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/types.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
})
