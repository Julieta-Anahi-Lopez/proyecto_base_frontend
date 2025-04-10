//services/api.tsx
import { store } from '../store'; // Asegúrate que esta ruta sea correcta
import { logout } from '../redux/slices/authSlice';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Helper para construir query strings
const buildQueryString = (params: Record<string, any>) => {
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
  
  const queryString = new URLSearchParams(filteredParams).toString();
  return queryString ? `?${queryString}` : '';
};

// Helper para obtener headers con el token actual
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.token;
  
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// Función genérica para hacer solicitudes API
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  // Asegúrate de que la URL comience con una barra
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${apiUrl}${normalizedEndpoint}`;
  
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  try {
    console.log(`🔵 Haciendo solicitud a: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Manejar token expirado/inválido
    if (response.status === 401) {
      // Limpiar la sesión y tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      store.dispatch(logout());
      
      // Redirigir a la página de login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
    }


    // Para respuestas no-JSON (como 204 No Content)
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      console.log(`🔴 Error en respuesta: ${response.status}`, data);
      throw new Error(data.detail || data.error || 'Ocurrió un error en la solicitud');
    }

    console.log(`🟢 Respuesta exitosa de: ${url.split('?')[0]}`);
    return data;
  } catch (error) {
    console.error('Error en la solicitud API:', error);
    throw error;
  }
};

// API Service object
export const apiService = {
  // Métodos HTTP generales
  get: (endpoint: string) => fetchApi(endpoint, { method: 'GET' }),
  
  post: (endpoint: string, data: any) => fetchApi(endpoint, { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  
  put: (endpoint: string, data: any) => fetchApi(endpoint, { 
    method: 'PUT', 
    body: JSON.stringify(data) 
  }),
  
  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),
  
  // Métodos específicos para endpoints de tu API
  getProducts: (filters = {}) => {
    const queryString = buildQueryString(filters);
    return fetchApi(`/articulos${queryString}`);
  },
  
  getCategories: () => fetchApi('/categorias/'),
  
  getSubcategories: (categoryId?: string) => {
    const query = categoryId ? `?nrogru=${categoryId}` : '';
    return fetchApi(`/subcategorias${query}`);
  },
  
  // Método existente
  createPedido: (pedidoData: any) => fetchApi('/pedidos/', {
    method: 'POST',
    body: JSON.stringify(pedidoData)
  }),
};