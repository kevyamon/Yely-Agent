// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
});

// INTERCEPTEUR : Injecte le token automatiquement s'il existe
api.interceptors.request.use((config) => {
  // CORRECTION : On utilise la bonne clé ('agentToken')
  const token = localStorage.getItem('agentToken');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTEUR : Gère les erreurs de session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si le token est invalide, expiré ou manquant
    if (error.response && error.response.status === 401) {
      
      // CORRECTION : On nettoie les bonnes clés
      localStorage.removeItem('agentToken');
      localStorage.removeItem('agentInfo');
      
      // On ne redirige que si on n'est pas déjà sur la page login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;