// frontend/src/lib/api-client.ts
import axios from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: any;
}

// Instance Axios configurée
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 2000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de réponse : gestion automatique des erreurs
apiClient.interceptors.response.use(
  (response) => response, // Succès : on laisse passer
  (error) => {
    // Construction du message d'erreur personnalisé
    const apiError: ApiError = {
      message: 'Une erreur est survenue',
      statusCode: error.response?.status,
      details: error.response?.data,
    };

    // Messages personnalisés selon le code HTTP
    if (error.response) {
      switch (error.response.status) {
        case 400:
          apiError.message = 'Requête invalide';
          break;
        case 401:
          apiError.message = 'Non authentifié';
          break;
        case 403:
          apiError.message = 'Accès refusé';
          break;
        case 404:
          apiError.message = 'Ressource introuvable';
          break;
        case 409:
          apiError.message = 'Conflit de données';
          break;
        case 422:
          apiError.message = 'Données invalides';
          break;
        case 500:
          apiError.message = 'Erreur serveur';
          break;
        case 503:
          apiError.message = 'Service indisponible';
          break;
        default:
          apiError.message = error.response.data?.message || 'Erreur inconnue';
      }
    } else if (error.request) {
      // Pas de réponse du serveur
      apiError.message = 'Impossible de contacter le serveur. Est-il démarré ?';
    }

    // On rejette avec notre ApiError formatée
    return Promise.reject(apiError);
  }
);