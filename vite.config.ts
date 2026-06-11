import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const target = env.VITE_PROXY_TARGET || 'https://ocean-app.1m85g5.easypanel.host';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: target,
          changeOrigin: true,
          secure: false,
        },
        '/upload': {
          target: target,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
