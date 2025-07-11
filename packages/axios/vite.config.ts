import fs from 'node:fs'
import { builtinModules } from 'node:module'

import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'node22',
    lib: {
      formats: ['es'],
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
        ...builtinModules.map((mod) => `node:${mod}`),
        'form-data'
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
  },
  /**
   * 编译结束插件
   */
  plugins: [
    {
      name: 'axios-plugin',
      closeBundle () {
        fs.cpSync('./node_modules/axios/index.d.ts', './dist/index.d.ts')
        console.log('构建axios成功!')
      }
    }
  ]
})
