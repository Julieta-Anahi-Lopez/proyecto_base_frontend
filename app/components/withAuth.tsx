// components/withAuth.tsx
"use client";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { ComponentType } from 'react';

// HOC para proteger rutas que requieren autenticación
const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const WithAuthComponent = (props: P) => {
    const { isAuthenticated, loading } = useAppSelector(state => ({
      isAuthenticated: state.auth.isAuthenticated,
      loading: state.auth.loading
    }));
    const router = useRouter();

    useEffect(() => {
      // Si no está autenticado y no está cargando, redirigir al login
      if (!loading && !isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, loading, router]);

    // Mientras verifica autenticación, mostrar spinner
    if (loading || !isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    // Si está autenticado, renderizar el componente protegido
    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;