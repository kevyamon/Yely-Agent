// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
});

// INTERCEPTEUR : Injecte le token automatiquement s'il existe
api.interceptors.request.use((config) => {
  // On utilise localStorage pour que la session survive à la fermeture du navigateur
  const token = localStorage.getItem('yely_agent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// INTERCEPTEUR : Gère les erreurs de session
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si vraiment le token est mort (après 6 mois), on nettoie tout
      localStorage.removeItem('yely_agent_token');
      localStorage.removeItem('agent_data');
      // On ne redirige que si on n'est pas déjà sur la page login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  }
);

export default api;