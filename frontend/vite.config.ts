// PARA TESTARMOS A INTEGRACAO FRONT E BACKEND SEM PRECISAR DO DOCKERCOMPOSE

export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002', // porta onde o backend está exposto
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}