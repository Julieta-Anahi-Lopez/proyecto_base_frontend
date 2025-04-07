// redux/slices/authSlice.tsx
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  nombre?: string;
  codigo?: string;
  // Añade más propiedades según lo que devuelva tu API
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Cargar datos del localStorage al inicializar
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    
    return {
      user: user ? JSON.parse(user) : null,
      token: token,
      isAuthenticated: !!token,
      loading: false,
      error: null,
    };
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  };
};

// Acción asíncrona para login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, clave }: { email: string; clave: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, clave }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Error en el inicio de sesión');
      }

      // Guardar en localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return {
        token: data.token,
        user: data.user,
      };
    } catch (error) {
      return rejectWithValue('Error de conexión con el servidor');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Añadir esta nueva función aquí
    restoreAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
          state.token = token;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  
});

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;