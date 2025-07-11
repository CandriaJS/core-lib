import { defineConfig, type Options } from 'tsdown'

export const options: Options = ({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, emitDtsOnly: true, sourcemap: false },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  clean: false,
  sourcemap: false
})
export default defineConfig(options)
