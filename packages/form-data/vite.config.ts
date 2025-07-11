import fs from 'node:fs'
import { builtinModules } from 'node:module'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node22',
    lib: {
      formats: [
        'es'
      ],
      fileName: () => 'index.js',
      entry: [
        'src/index.ts'
      ]
    },
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`)
      ],
      output: {
        inlineDynamicImports: true
      },
    },
    minify: true,
    commonjsOptions: {
      include: [
        /node_modules/
      ],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    }
  }
})
