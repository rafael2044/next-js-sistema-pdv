"use client";
import { useState, useEffect, use } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, UserCog } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        role: "seller",
        password: "", // Se preenchido, troca a senha
    });

    useEffect(() => {
        const init = async () => {
            const p = await params;
            setUserId(p.id);
            fetchUser(p.id);
        };
        init();
    }, [params]);

    const fetchUser = async (id: string) => {
        try {
            const res = await api.get(`/users/${id}`);
            setFormData({
                name: res.data.name,
                role: res.data.role,
                password: "", // Senha vem vazia por segurança
            });
        } catch (e) { toast.error("Usuário não encontrado"); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Monta payload apenas com o necessário
            const payload: any = { name: formData.name, role: formData.role };
            if (formData.password) payload.password = formData.password; // Só envia se digitou algo

            await api.put(`/users/${userId}`, payload);
            toast.success("Usuário atualizado!");
            router.push("/users");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/users" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserCog /> Editar Usuário
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="seller">Vendedor</option>
                            <option value="manager">Gerente</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                        <label className="block text-sm font-bold text-yellow-800 mb-1">Redefinir Senha</label>
                        <input
                            type="password"
                            placeholder="Deixe em branco para não alterar"
                            className="w-full p-2 border border-yellow-300 rounded focus:ring-yellow-500 bg-white"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <p className="text-xs text-yellow-700 mt-1">Preencha apenas se desejar trocar a senha deste usuário.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
                    >
                        {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>
            </div>
        </div>
    );
}