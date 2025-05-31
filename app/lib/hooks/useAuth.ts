// lib/hooks/useAuth.ts
import { useEffect, useState } from "react";

interface User {
  nombre: string;
  [key: string]: any;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.warn("⚠️ Error al parsear usuario desde localStorage:", error);
      }
    }

    setAuthChecked(true);
  }, []);

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    user,
    isAuthenticated,
    authChecked,
    logout, // ✅ ahora sí exportado correctamente
  };
}
