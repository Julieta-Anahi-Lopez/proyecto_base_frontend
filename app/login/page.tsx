'use client';

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Head from 'next/head';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import RegisterForm from '../components/RegisterForm';
import Image from 'next/image';
import { PasswordField } from '../components/PasswordField';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth || { loading: false, error: null, isAuthenticated: false });
  const loading = auth.loading;
  const error = auth.error;
  const isAuthenticated = auth.isAuthenticated;
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/catalogo');
    }

    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, router, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser({ email, clave: password }));
      if (loginUser.fulfilled.match(resultAction)) {
        router.push('/catalogo');
      } else {
        setToastMessage(resultAction?.payload?.detail || "No se pudo iniciar sesión");
        setShowToast(true);
      }
    } catch (err: any) {
      console.error("Error en login:", err);
      setToastMessage("Error inesperado al iniciar sesión");
      setShowToast(true);
    }
  };

  const toggleRegister = () => {
    setShowRegister(!showRegister);
    dispatch(clearError());
  };

  return (
    <>
      <Head>
        <title>{showRegister ? 'Crear Cuenta' : 'Iniciar Sesión'} | Mi E-commerce</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Image
            src="/images/logos/400px x 100 px KLINNER - ENCABEZADO - recortada.png"
            alt="Logo Klinner"
            width={220}
            height={110}
            priority
            className="object-contain"
          />
        </div>

        {showRegister ? (
          <div className="w-full max-w-md">
            <RegisterForm onCancel={toggleRegister} />
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                Iniciar Sesión
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Ingresa a tu cuenta para acceder al sistema
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <PasswordField
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Contraseña"
                  required
                />
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

              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleRegister}
                  className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
                >
                  ¿No tenés cuenta? Registrate!
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/catalogo')}
                  className="
                    mt-4 
                    w-full 
                    flex 
                    justify-center 
                    py-2 
                    px-4 
                    border 
                    border-gray-300 
                    text-sm 
                    font-medium 
                    rounded-md 
                    text-gray-700 
                    bg-gray-100 
                    hover:bg-gray-150 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-offset-2 
                    focus:ring-blue-500
                  "
                >
                  Continuar sin iniciar sesión
                </button>
              </div>


              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="
                      mt-2 
                      w-full 
                      flex 
                      justify-center 
                      py-2 
                      px-4 
                      border 
                      border-gray-300 
                      text-sm 
                      font-medium 
                      rounded-md 
                      text-gray-700 
                      bg-gray-100 
                      hover:bg-gray-150 
                      focus:outline-none 
                      focus:ring-2 
                      focus:ring-offset-2 
                      focus:ring-blue-500
                    "
                                >
                  Ir al inicio
                </button>
              </div>

            </form>
          </div>
        )}
      </div>


      {/* Toast emergente */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white py-3 px-4 rounded-md shadow-lg transition-opacity duration-300 z-50 w-[95vw] max-w-xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10A8 8 0 11.999 10 8 8 0 0118 10zM9 5a1 1 0 012 0v4a1 1 0 01-2 0V5zm1 8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">{toastMessage}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="bg-white text-red-600 font-semibold text-sm px-4 py-1.5 rounded-md shadow-sm hover:bg-gray-100 transition w-full sm:w-auto"
          >
            Cerrar
          </button>
        </div>
      )}
    </>
  );
}
