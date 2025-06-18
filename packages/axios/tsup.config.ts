import fs from 'node:fs'
import { builtinModules } from 'node:module'

import { defineConfig, type Options } from 'tsup'


export const options: Options = ({
  entry: ['src/index.ts'],      // 入口文件
  format: ['esm'],       // ESM格式
  bundle: true,                 // 打包依赖
  dts: false,                    // 生成类型声明文件
  clean: true,                  // 清理dist目录
  minify: true,                 // 压缩生产环境代码
  target: 'node22',             // 指定ECMAScript目标版本
  sourcemap: false,              // 生成sourcemap
  treeshake: true,              // 启用树摇优化
  platform: 'node',            // 指定为Node.js环境
  splitting: false,             // 代码分割, 是否拆分文件
  outDir: 'dist',               // 指定输出目录
  external: [
    ...builtinModules,
    ...builtinModules.map((mod) => `node:${mod}`),
    'form-data',
  ],                 // 外部依赖, 不打包进输出文件中
  outExtension: ( ) => ({
    js: '.js'
  }),
  onSuccess: async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    copyFiles()
  }
})

export default defineConfig(options)

const copyFiles = () => {
  fs.copyFileSync('./node_modules/axios/index.d.ts', './dist/index.d.ts')
  console.log('构建axios成功!')
}
