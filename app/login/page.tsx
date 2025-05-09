"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import RegisterForm from '../components/RegisterForm';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth || { loading: false, error: null, isAuthenticated: false });
  const loading = auth.loading;
  const error = auth.error;
  const isAuthenticated = auth.isAuthenticated;
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/catalogo');
    }
    
    // Limpiar errores al montar el componente
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, router, dispatch]);

  // Función para manejar el inicio de sesión
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log("Intentando iniciar sesión con:", { email, password: "***" });
      const resultAction = await dispatch(loginUser({ email, clave: password }));
      
      console.log("Resultado de la acción:", resultAction);
      
      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Login exitoso. Token:", resultAction.payload.token);
        
        // Esperar un momento antes de redirigir
        setTimeout(() => {
          console.log("Redirigiendo a catalogo...");
          router.push('/catalogo');
        }, 500);
      }
    } catch (err) {
      console.error("Error en login:", err);
    }
  };

  // Alternar entre login y registro
  const toggleRegister = () => {
    setShowRegister(!showRegister);
    // Limpiar errores al cambiar de formulario
    dispatch(clearError());
  };

  return (
    <>
      <Head>
        <title>{showRegister ? 'Crear Cuenta' : 'Iniciar Sesión'} | Mi E-commerce</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
            alt="Logo Klinner"
            width={220}
            height={110}
            priority={true}
            className="object-contain"
          />
        </div>
        
        {showRegister ? (
          // Mostrar formulario de registro
          <div className="w-full max-w-md">
            <RegisterForm onCancel={toggleRegister} />
          </div>
        ) : (
          // Mostrar formulario de inicio de sesión
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ingresa a tu cuenta para acceder al sistema
              </p>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </span>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </div>
              
              {/* Enlace para registrarse */}
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={toggleRegister}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  ¿No tenés cuenta? Registrate!
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}