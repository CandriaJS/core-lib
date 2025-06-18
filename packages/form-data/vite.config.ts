import fs from 'node:fs'
import { builtinModules } from 'node:module'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node18',
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
      cache: false
    },
    minify: false,
    commonjsOptions: {
      include: [
        /node_modules/
      ],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    }
  }
})
