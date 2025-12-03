"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: string | null;
  role: string | null; // <--- NOVO
  login: (token: string, username: string, role: string) => void; // <--- Recebe role
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean; // <--- NOVO
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // <--- Começa como TRUE
  const router = useRouter();

  useEffect(() => {
    // Recupera dados ao iniciar
    const recoverUser = () => {

      const token = Cookies.get("token");
      const savedUser = Cookies.get("user");
      const savedRole = Cookies.get("role"); // <--- NOVO

      if (token && savedUser) {
        setUser(savedUser);
        setRole(savedRole || null); // <--- NOVO
      }

      setLoading(false); // <--- Terminou de verificar
    };

    recoverUser();
  }, []);

  const login = (token: string, username: string, role: string) => {
    Cookies.set("token", token);
    Cookies.set("user", username);
    Cookies.set("role", role); // <--- NOVO
    setUser(username);
    setRole(role || null); // <--- NOVO
    router.push("/")
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role"); // <--- NOVO
    setUser(null);
    setRole(null); // <--- NOVO
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);