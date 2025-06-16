// services/api.ts
import { logoutGlobal } from '@/app/lib/hooks/useAuth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// 🔧 Función auxiliar para construir query strings
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

// 🔐 Obtener headers con token actual (si existe)
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

// 🌐 Función genérica para hacer solicitudes a la API
const fetchApi = async (
  endpoint: string,
  options: RequestInit = {},
  retryWithoutAuth = true // permite retry si es endpoint público
) => {
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

    // 🧼 Token inválido o vencido
    if (response.status === 401) {
      const contentType = response.headers.get("content-type");

      let data: any = null;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text(); // fallback para inspección
        console.warn("⚠️ Respuesta no JSON recibida:", text);
        throw new Error("Respuesta inesperada del servidor.");
      }

      const tokenInvalid =
        data?.code === 'token_not_valid' ||
        data?.detail?.includes?.('token') ||
        data?.messages?.some?.((m: any) => m.message?.includes?.('expired'));

      if (tokenInvalid) {
        console.warn('⚠️ Token vencido. Limpiando sesión...');
        logoutGlobal();

        if (retryWithoutAuth) {
          console.log('🔁 Reintentando sin token...');
          return fetchApi(endpoint, { ...options, headers: {} }, false);
        }

        if (typeof window !== 'undefined') {
          window.location.replace('/login');
          return new Promise(() => {});
        }

        throw new Error('Sesión expirada. Por favor inicia sesión.');
      }
    }

    // Sin contenido (204 No Content)
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");

    let data: any = null;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text(); // fallback para inspección
      console.warn("⚠️ Respuesta no JSON recibida:", text);
      throw new Error("Respuesta inesperada del servidor.");
    }

    if (!response.ok) {
      console.log(`🔴 Error en respuesta: ${response.status}`, data);
      throw new Error(data.detail || data.error || 'Ocurrió un error en la solicitud');
    }

    console.log(`🟢 Respuesta exitosa de: ${url.split('?')[0]}`);
    return data;
  } catch (error) {
    console.error('❌ Error en la solicitud API:', error);
    throw error;
  }
};

// ✅ API Service público
export const apiService = {
  // Métodos HTTP genéricos
  get: (endpoint: string) => fetchApi(endpoint, { method: 'GET' }),

  post: (endpoint: string, data: any) =>
    fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint: string, data: any) =>
    fetchApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (endpoint: string) => fetchApi(endpoint, { method: 'DELETE' }),

  // Métodos específicos para tu API
  getProducts: (filters = {}) => {
    const queryString = buildQueryString(filters);
    return fetchApi(`/articulos${queryString}`, {}, true); // ✅ público
  },

  getCategories: () => fetchApi('/categorias/', {}, true),

  getSubcategories: (categoryId?: string) => {
    const query = categoryId ? `?nrogru=${categoryId}` : '';
    return fetchApi(`/subcategorias${query}`, {}, true);
  },

  getMarcas: () => fetchApi("/tipo-marcas/", {}, true),

  getRubros: () => fetchApi("/tipo-rubros-con-subrubros", {}, true),

  createPedido: async (pedidoData: any) => {
    console.log("📤 Enviando pedido:", pedidoData);
    return fetchApi('/pedidos/', {
      method: 'POST',
      body: JSON.stringify(pedidoData)
    });
  }, // 🔒 privado: no reintenta sin token

  getPedidosCliente: () => fetchApi("/pedidos/usuario/mis-pedidos/", {}, false),

};


