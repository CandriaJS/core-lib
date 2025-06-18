import { defineConfig, type Options } from 'tsup'

export const options: Options = ({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
})
export default defineConfig(options)
