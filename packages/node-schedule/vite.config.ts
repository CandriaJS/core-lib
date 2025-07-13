import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import fs from 'node:fs'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['es'],
      fileName: 'index',
      entry: ['src/index.ts'],
    },
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      external: [
        ...builtinModules,
        ...builtinModules.map((mod) => `node:${mod}`),
      ],
      output: {
        inlineDynamicImports: true,
      },
    },
    minify: true,
    commonjsOptions: {
      include: [
        /node_modules/,
      ],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    },
  },
    /**
     * 编译结束插件
     */
    plugins: [
      {
        name: 'node-schedule-plugin',
        closeBundle () {
          fs.cpSync('./node_modules/@types/node-schedule/index.d.ts', './dist/index.d.ts')
          console.log('构建node-schedule成功!')
        }
      }
    ]
})