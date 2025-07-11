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
    "README.md"
  ],
  "scripts": {    
    "build": "vite build && tsdown",
    "sync": "curl -X PUT \\\"https://registry-direct.npmmirror.com/-/package/@candriajs/${name}/syncs\\\""
  },
  "engines": {
    "node": ">=18"
  }
}`
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(JSON.parse(template), null, 2))
}

const tsdown = (dir: string) => {
  const template = `import { defineConfig, type Options } from 'tsdown'

export const options: Options = ({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: { resolve: true, emitDtsOnly: true, sourcemap: false },
  outDir: 'dist',
  target: 'node22',
  platform: 'node',
  minify: true,
  clean: false,
  sourcemap: false
})
export default defineConfig(options)
`

  fs.writeFileSync(path.join(dir, 'tsdown.config.ts'), template)
}

const vite = (dir: string) => { 
  const template = `import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

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
        ...builtinModules.map((mod) => \`node:\${mod}\`),
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
  }
})`
  fs.writeFileSync(path.join(dir, 'vite.config.ts'), template)
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
  config.jobs['release'].outputs[`${name}_rerelease`] = `\${{ steps.release-please.outputs['packages/${name}--release_created'] }}`

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
          version: '10.12.4',
          run_install: '- args: [--no-frozen-lockfile]'
        }
      },
      {
        name: '构建',
        run: `pnpm build\nmkdir -p \${{ runner.temp }}/temp/${name}\ncp -r package.json README.md dist \${{ runner.temp }}/temp/${name}`,
        'working-directory': `packages/${name}`
      },
      {
        name: '上传构建产物',
        uses: 'actions/upload-artifact@v4',
        with: {
          name,
          path: `\${{ runner.temp }}/temp/${name}`
        }
      },
      {
        name: '发布到 GitHub Packages',
        uses: 'JS-DevTools/npm-publish@v3',
        with: {
          token: '${{ secrets.GITHUB_TOKEN }}',
          registry: 'https://npm.pkg.github.com',
          package: `packages/${name}/package.json`
        }
      },
      {
        name: '发布到 NPM',
        uses: 'JS-DevTools/npm-publish@v3',
        with: {
          token: '${{ secrets.NPM_TOKEN }}',
          registry: 'https://registry.npmjs.org/',
          package: `packages/${name}`,
          access: 'public',
          provenance: true
        }
      }
    ]
  }

  fs.writeFileSync(`${dir}/.github/workflows/release.yaml`, yaml.stringify(config))
}

const files = (dir: string, name: string) => {
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
  if (!fs.existsSync(path.join(dir, 'README.md'))) {
    fs.writeFileSync(path.join(dir, 'README.md'), `# ${name}\n`)
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
  files(dir, name)
  pack(dir, name)
  release(basePath, name)
  ci(basePath, name)
  tsdown(dir)
  vite(dir)
  console.log('初始化成功')
}
