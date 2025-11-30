"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";

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
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        const savedRole = localStorage.getItem("role"); // <--- NOVO

        if (token && savedUser) {
          setUser(savedUser);
          setRole(savedRole); // <--- NOVO
        }
      }
      setLoading(false); // <--- Terminou de verificar
    };

    recoverUser();
  }, []);

  const login = (token: string, username: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", username);
    localStorage.setItem("role", role); // <--- NOVO
    setUser(username);
    setRole(role); // <--- NOVO
    router.push("/")
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role"); // <--- NOVO
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