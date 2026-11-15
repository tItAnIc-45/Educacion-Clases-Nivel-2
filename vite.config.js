import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const raiz = fileURLToPath(new URL('.', import.meta.url))

/* public/ se copia automáticamente a dist/ (assets, css, js y pages).
   Aquí solo se añaden las páginas HTML de entrada que Vite no procesa
   porque el único input del build es react.html. */
const copiarSitio = () => ({
  name: 'copiar-sitio-estatico',
  apply: 'build',
  closeBundle() {
    const destino = resolve(raiz, 'dist')
    const piezas = [
      'index.html',
      '404.html',
    ]
    for (const pieza of piezas) {
      const origen = resolve(raiz, pieza)
      if (existsSync(origen)) {
        cpSync(origen, resolve(destino, pieza), { recursive: true })
      }
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    copiarSitio(),
  ],
  build: {
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./react.html', import.meta.url)),
      },
    },
  },
})
