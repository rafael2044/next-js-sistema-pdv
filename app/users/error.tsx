"use client"; // Obrigatório!

import { useEffect } from "react";
import Link from "next/link";

// O componente de erro recebe duas props automaticamente:
// error: os detalhes do problema
// reset: uma função para tentar renderizar a página novamente
export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {

    useEffect(() => {
        // Aqui você poderia enviar o erro para um serviço de log (Sentry, Datadog, etc)
        console.error("Erro capturado:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <h2 className="text-4xl font-bold text-red-500 mb-4">Algo deu errado!</h2>
            <p className="text-gray-300 mb-8 border border-red-900 bg-red-900/20 p-4 rounded">
                {error.message || "Erro desconhecido ao carregar utilizador."}
            </p>

            <div className="flex gap-4">
                <button
                    onClick={() => reset()} // Tenta recarregar a rota sem recarregar a página toda
                    className="px-6 py-3 bg-red-600 rounded hover:bg-red-700 transition-colors font-bold"
                >
                    Tentar Novamente
                </button>

                <Link
                    href="/"
                    className="px-6 py-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                >
                    Voltar ao PDV
                </Link>
            </div>
        </main>
    );
}