/* eslint-disable no-template-curly-in-string */
import fs from 'node:fs'
import path from 'node:path'

import { input } from '@inquirer/prompts'
import yaml from 'yaml'

import { basePath } from '@/cli/version'
const pack = (dir: string, name: string) => {
  const template = `{
  "name": "@candriajs/${name}",
  "version": "1.0.0",
  "description": "一些常用包以及常用函数进行封装，并打包优化, 此包为${name}封装",
  "keywords": [
    "${name}"
  ],
  "homepage": "https://github.com/CandriaJS/core-lib",
  "bugs": {
    "url": "https://github.com/CandriaJS/core-lib/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/CandriaJS/core-lib.git"
  },
  "license": "GNU AGPL-3.0",
  "author": "CandriaJS",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "index.js"
  ],
  "scripts": {    
    "build": "tsc --noEmit && tsup",
    "sync": "curl -X PUT \\\"https://registry-direct.npmmirror.com/-/package/@candriajs/${name}/syncs\\\""
  },
  "engines": {
    "node": ">=18"
  }
}`
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(JSON.parse(template), null, 2))
}

const tsup = (dir: string) => {
  const template = `import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, only: true },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  outExtension: ( ) => ({
    js: '.js'
  })
})
`

  fs.writeFileSync(path.join(dir, 'tsup.config.ts'), template)
}

const release = (dir: string, name: string) => {
  const config = JSON.parse(fs.readFileSync(`${dir}/.release-please-config.json`, 'utf-8'))
  config.packages[`packages/${name}`] = {
    'release-type': 'node',
    'package-name': `@candriajs/${name}`,
    component: name,
    'tag-separator': '-',
    scope: name
  }
  fs.writeFileSync(`${dir}/.release-please-config.json`, JSON.stringify(config, null, 2))

  const manifest = JSON.parse(fs.readFileSync(`${dir}/.release-please-manifest.json`, 'utf-8'))
  manifest[`packages/${name}`] = '1.0.0'
  fs.writeFileSync(`${dir}/.release-please-manifest.json`, JSON.stringify(manifest, null, 2))
}

const ci = (dir: string, name: string) => {
  const config = yaml.parse(fs.readFileSync(`${dir}/.github/workflows/release.yaml`, 'utf-8'))
  config.jobs['release'].outputs[`${name}_rerelease`] = `\${{ steps.release.outputs['packages/${name}--release_created'] }}`

  config.jobs[`publish-${name}`] = {
    needs: 'release',
    if: `\${{ needs.release.outputs.${name}_rerelease == 'true' }}`,
    'runs-on': 'ubuntu-latest',
    steps: [
      {
        name: '检出代码',
        uses: 'actions/checkout@v4',
        with: {
          ref: 'main',
          'fetch-depth': 0
        }
      },
      {
        name: '设置 pnpm',
        uses: 'pnpm/action-setup@v4',
        with: {
          version: '9.13.2',
          run_install: '- args: [--no-frozen-lockfile]'
        },
        env: {
          'working-directory': '.'
        }
      },
      {
        name: '构建',
        id: 'build-package',
        run: 'pnpm build\npnpm pkg delete devDependencies\nmkdir -p ${{ runner.temp }}/temp/${name}\ncp -r package.json README.md dist ${{ runner.temp }}/temp/${name}',
        env: {
          WORKING_DIR: `packages/${name}`
        }
      },
      {
        name: '上传构建产物',
        uses: 'actions/upload-artifact@v4',
        with: {
          name,
          path: `\${{ runner.temp }}/temp/${name}`
        },
        env: {
          WORKING_DIR: `packages/${name}`
        }
      },
      {
        name: '发布到 GitHub Packages',
        id: 'publish-to-github',
        uses: 'JS-DevTools/npm-publish@v3',
        with: {
          token: '${{ secrets.GITHUB_TOKEN }}',
          registry: 'https://npm.pkg.github.com'
        },
        env: {
          WORKING_DIR: `packages/${name}`
        }
      },
      {
        name: '发布到 NPM',
        id: 'publish-to-npm',
        uses: 'JS-DevTools/npm-publish@v3',
        with: {
          token: '${{ secrets.NPM_TOKEN }}',
          registry: 'https://registry.npmjs.org/',
          access: 'public',
          provenance: true
        },
        env: {
          WORKING_DIR: `packages/${name}`
        }
      }
    ]
  }

  fs.writeFileSync(`${dir}/.github/workflows/release.yaml`, yaml.stringify(config))
}

const files = (dir: string) => {
  fs.mkdirSync(dir, { recursive: true })
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true })
  // src/index.ts
  if (!fs.existsSync(path.join(dir, 'src', 'index.ts'))) {
    fs.writeFileSync(path.join(dir, 'src', 'index.ts'), '')
  }
  const config = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './dist',
      rootDir: './src'
    },
    include: [
      'src/**/*'
    ],
    exclude: [
      'node_modules',
      'dist'
    ]
  }

  // tsconfig.json
  if (!fs.existsSync(path.join(dir, 'tsconfig.json'))) {
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify(config, null, 2))
  }
}

export async function init () {
  const options = {
    projecName: await input(
      {
        message: '你的项目名称:',
        default: 'my-project'
      }
    )
  }
  const name = options.projecName
  const dir = path.join(basePath, 'packages', name)
  files(dir)
  pack(dir, name)
  release(basePath, name)
  ci(basePath, name)
  tsup(dir)
  console.log('初始化成功')
}
