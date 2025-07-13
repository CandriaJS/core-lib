import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

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
  plugins: [
    {
      name: 'lodash-plugin',
      closeBundle () {
  const sourceDir = './node_modules/@types/lodash'
  const targetDir = './dist/types'

  const copyRecursiveSync = (src: string, dest: string) => {
    const stat = fs.statSync(src)
    
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true })
      fs.readdirSync(src).forEach(item => {
        copyRecursiveSync(
          path.join(src, item),
          path.join(dest, item)
        )
      })
    } else {
      fs.copyFileSync(src, dest)
    }
  }

  copyRecursiveSync(sourceDir, targetDir)
  console.log('构建 lodash 成功!')
      }
    }
  ]
})