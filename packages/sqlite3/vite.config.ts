import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import fs from 'node:fs'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['es'],
      fileName: 'sqlite3',
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
    minify: 'terser',
    commonjsOptions: {
      include: [
        /node_modules/,
      ],
      transformMixedEsModules: true,
      defaultIsModuleExports: true
    },
  },
  plugins: [
    {
      name: 'sqlite3-plugin',
      closeBundle () {
        fs.cpSync('./index.js', './dist/index.js')
        console.log('构建sqlite3成功!')
      }
    }
  ],
})
