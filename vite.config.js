import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  
  // Performance optimizations
  build: {
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          pdf: ['jspdf', 'jspdf-autotable'],
          icons: ['lucide-react']
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for debugging (can disable in production)
    sourcemap: false
  },
  
  // Development server optimizations
  server: {
    hmr: {
      overlay: false // Disable error overlay for smoother development
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'recharts',
      'jspdf',
      'jspdf-autotable',
      'lucide-react'
    ]
  }
})
=======
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
>>>>>>> 04f545bdf77060208b211e0c0e429f712234081c
