import { defineConfig, type Options } from 'tsdown'

export const options: Options = ({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { sourcemap: false },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  clean: true,
  sourcemap: false
})
export default defineConfig(options)
