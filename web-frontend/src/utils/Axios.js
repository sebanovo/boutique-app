import axios from 'axios';

export const server = axios.create({
  baseURL: '/api', // ✅ gracias al proxy de Vite, no necesitas URL completa
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // solo si usas cookies o sesiones
});

server.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('❌ Error en respuesta:', error.response.data);
    } else {
      console.error('⚠️ Error de red:', error.message);
    }
    return Promise.reject(error);
  }
);
