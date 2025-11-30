"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserPlus, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function CreateUser() {
    const router = useRouter();
    const { role, loading: authLoading } = useAuth(); // Pegamos a role do contexto
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        role: "seller", // Valor padrão
    });

    // PROTEÇÃO DE ROTA: Apenas Manager e Admin
    useEffect(() => {
        if (!authLoading) {
            if (role !== "admin" && role !== "manager") {
                alert("Acesso negado. Você não tem permissão para acessar esta página.");
                router.push("/");
            }
        }
    }, [role, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/register", formData);
            toast.success("Usuário cadastrado com sucesso!");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.detail || "Erro ao cadastrar usuário");
        } finally {
            setLoading(false);
        }
    };

    // Enquanto verifica a permissão, não mostra nada (ou um loader)
    if (authLoading || (role !== "admin" && role !== "manager")) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-lg">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar ao PDV
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserPlus /> Novo Usuário
                    </h1>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">

                    {/* Nome Completo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: João da Silva"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Usuário (Login) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome de Usuário (Login)</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: joao.silva"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Senha */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Senha de Acesso</label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6} // Validação básica
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            placeholder="******"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Cargo / Permissão */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Acesso</label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                            >
                                <option value="seller">Vendedor (Padrão)</option>
                                <option value="manager">Gerente</option>
                                {/* Apenas Admins deveriam poder criar outros Admins, mas deixarei liberado conforme pedido */}
                                <option value="admin">Administrador</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        {/* Dica visual sobre o cargo */}
                        <div className="mt-2 p-3 bg-blue-50 rounded text-xs text-blue-800 flex gap-2 items-start">
                            <ShieldAlert size={14} className="mt-0.5" />
                            <span>
                                {formData.role === 'seller' && "Acesso apenas para realizar vendas e abrir/fechar o próprio caixa."}
                                {formData.role === 'manager' && "Pode gerenciar produtos, estoque e cadastrar novos usuários."}
                                {formData.role === 'admin' && "Acesso total ao sistema."}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                        <Link
                            href="/"
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? "Salvando..." : "Cadastrar Usuário"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}