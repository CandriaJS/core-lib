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
  const sourceDir = './node_modules/lod'
  const targetDir = './dist/types'
  
  fs.mkdirSync(targetDir, { recursive: true })
  
  const files = fs.readdirSync(sourceDir)
  files.forEach(file => {
    fs.copyFileSync(
      path.join(sourceDir, file),
      path.join(targetDir, file)
    )
  })
  console.log('构建lodash成功!')
}