import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const raiz = fileURLToPath(new URL('.', import.meta.url))

/* Copia el sitio estático dentro de dist para que la vista React conserve
   imágenes, páginas internas y sus scripts al desplegar el resultado. */
const copiarSitio = () => ({
  name: 'copiar-sitio-estatico',
  apply: 'build',
  closeBundle() {
    const destino = resolve(raiz, 'dist')
    const piezas = [
      'assets',
      'css',
      'js',
      'pages',
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
