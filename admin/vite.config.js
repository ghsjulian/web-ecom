import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
        port: 5001,
allowedHosts: [
      '6bc1a6b4b8ef.ngrok-free.app' 
      // 👈 Add your ngrok domain here
    ],
   },
define: {
        global: "window", 
    },
})
