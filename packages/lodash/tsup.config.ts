import { defineConfig } from 'tsup'
import fs from 'node:fs'
import path from 'node:path'
export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: false,
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  outExtension: ( ) => ({
    js: '.js'
  }),
  onSuccess: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    copyFiles()
  }
})


const copyFiles = () => {
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