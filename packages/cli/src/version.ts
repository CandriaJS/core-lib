import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** 当前文件所在路径 */
const filePath = Object.freeze(fileURLToPath(import.meta.url))

/** 当前包根目录 */
export const cliPath = Object.freeze(path.join(filePath, '../..').replace(/\\/g, '/'))

/** 根目录 */
export const basePath = Object.freeze(path.join(cliPath, '../..').replace(/\\/g, '/'))

/** package.json */
export const pkg = Object.freeze(JSON.parse(fs.readFileSync(path.join(cliPath, 'package.json'), 'utf-8')))
