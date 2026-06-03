const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://restaurante-ot8m.onrender.com';

/**
 * Helper centralizado para peticiones HTTP al backend.
 * Incluye automáticamente el token JWT en el header Authorization.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token && !endpoint.startsWith('/api/auth/')) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Si es 204 No Content, no intentar parsear JSON
  if (response.status === 204) {
    return null;
  }

  // Si hay error, lanzar excepción con el mensaje
  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Si no se puede parsear el body, usar el status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => request(endpoint, { method: 'GET' }),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (endpoint, data) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};
