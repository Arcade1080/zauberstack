import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
    plugins: [react()],
    define: {
      VITE_API_URL: `"${process.env.VITE_API_URL}"`,
      VITE_FILE_SERVER_URL: `"${process.env.VITE_FILE_SERVER_URL}"`,
    },
  };
});
