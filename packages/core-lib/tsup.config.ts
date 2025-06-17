import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  outExtension: ( ) => ({
    js: '.js'
  })
})
