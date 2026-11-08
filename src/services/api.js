// src/services/api.js
import axios from 'axios';

let rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
// Normalisation : évite le doublement de segment /agents si présent dans .env
if (rawBaseURL.endsWith('/agents')) {
  rawBaseURL = rawBaseURL.replace(/\/agents$/, '');
}

const api = axios.create({
  baseURL: rawBaseURL,
  timeout: 10000,
});

// INTERCEPTEUR : Injecte le token automatiquement s'il existe
api.interceptors.request.use((config) => {
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
