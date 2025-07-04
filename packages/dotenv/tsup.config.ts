import { defineConfig, type Options } from 'tsup'

export const options: Options = ({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  outExtension: ( ) => ({
    js: '.js'
  })
})
export default defineConfig(options)
