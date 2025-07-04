import { defineConfig, type Options } from 'tsup'

export const options: Options = ({
  entry: ['src/index.ts', 'src/config.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist'
})
export default defineConfig(options)
