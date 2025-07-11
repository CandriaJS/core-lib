import { defineConfig } from 'vite'
import { builtinModules } from 'node:module'

export default defineConfig({
  build: {
    target: 'es2022',
    lib: {
      formats: ['es'],
      fileName: () => 'index.js',
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
  }
})