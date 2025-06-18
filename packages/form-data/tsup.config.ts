import { defineConfig, Options } from 'tsup'
import fs from 'node:fs'
import path from 'node:path'

export const options: Options = ({
  entry: ['src/types.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
})
export default defineConfig(options)