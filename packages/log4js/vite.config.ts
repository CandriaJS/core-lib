import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import fs from 'node:fs'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['es'],
      fileName: () => 'log4js.js',
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
        format: 'es',
        inlineDynamicImports: true,
      },
    },
    minify: false,
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
      name: 'log4js-plugin',
      closeBundle () {
        fs.cpSync('./index.js', './dist/index.js')
        console.log('构建log4js成功!')
      }
    }
  ],
})