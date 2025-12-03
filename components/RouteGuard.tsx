"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie"; // Importação direta do cookie

export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    // Rotas que exigem cargo de Gerente ou Admin
    // O startsWith cobre as sub-rotas (ex: /products cobre /products/create)
    const protectedPrefixes = [
        "/products",
        "/users",
        "/reports",
        "/backup",
        "/stock"
    ];

    useEffect(() => {
        checkPermission();
    }, [pathname, loading, user, role]);

    const checkPermission = () => {
        // 1. Verificação Rápida via Cookie (Evita esperar o Context se não tiver token)
        const token = Cookies.get("token"); // Nome do cookie que você está salvando
        const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

        if (isProtectedRoute) {
            // Se não tem token no cookie, nem espera o AuthContext
            if (!token) {
                // Só exibe toast se não estivermos já no login para evitar spam
                if (pathname !== "/login") {
                    toast.error("Sessão expirada. Faça login novamente.");
                    router.push("/login");
                }
                return;
            }

            // 2. Se tem token, mas o Contexto ainda está carregando os dados do usuário, aguarda
            if (loading) {
                return;
            }

            // 3. Verificações de Contexto (Dados carregados)
            if (!user) {
                // Caso raro: tem token mas o contexto não achou usuário
                router.push("/login");
                return;
            }

            // 4. Verificação de Permissão (Role)
            if (role !== "admin" && role !== "manager") {
                toast.error("Acesso Negado: Área restrita a Gerentes.");
                router.push("/"); // Manda de volta para o PDV (Home)
                return;
            }
        }

        // Se passou por tudo, libera a renderização
        setIsChecking(false);
    };

    // Enquanto verifica ou carrega, mostra Loading para não "piscar" conteúdo proibido
    const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

    if (isProtectedRoute && (loading || isChecking)) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="flex flex-col items-center gap-2 text-blue-600">
                    <Loader2 className="animate-spin w-10 h-10" />
                    <span className="font-semibold">Verificando permissões...</span>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}