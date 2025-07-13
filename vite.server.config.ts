import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3006
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './src/server.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'esbuild',
      swcOptions: {},
    }),
  ],
  build: {
    outDir: 'dist/server',
    rollupOptions: {
      input: 'src/server.ts',
      output: {
        format: 'es',
        entryFileNames: 'server.js'
      }
    }
  },
  optimizeDeps: {
    exclude: [
      '@vitejs/plugin-react'
    ]
  }
}) 