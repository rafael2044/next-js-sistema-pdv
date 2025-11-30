"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowLeft, Search, Plus, Edit2, Trash2, UserCog, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UserData {
    id: number;
    name: string;
    username: string;
    role: string;
    is_active: boolean;
}

export default function UserList() {
    const { role, user: currentUser } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Proteção básica
        if (role !== "admin" && role !== "manager") {
            router.push("/");
            return;
        }
        fetchUsers();
    }, [role]);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/users/");
            setUsers(res.data);
        } catch (error) {
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (user: UserData) => {
        if (user.username === currentUser) {
            toast.error("Você não pode inativar a si mesmo!");
            return;
        }
        try {
            await api.put(`/users/${user.id}`, { is_active: !user.is_active });
            toast.success(`Usuário ${!user.is_active ? 'Ativado' : 'Inativado'}!`);
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
        } catch (error: any) {
            toast.error("Erro ao alterar status");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Tem certeza que deseja excluir este usuário permanentemente?")) return;
        try {
            await api.delete(`/users/${id}`);
            toast.success("Usuário excluído!");
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error: any) {
            const msg = error.response?.data?.detail || "Erro ao excluir";
            toast.error(msg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <UserCog /> Gestão de Usuários
                        </h1>
                    </div>
                    <Link href="/users/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow transition">
                        <Plus size={20} /> Novo Usuário
                    </Link>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4 border-b">Nome</th>
                                <th className="p-4 border-b">Login</th>
                                <th className="p-4 border-b">Cargo</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4 text-gray-500">{u.username}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                u.role === 'manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {u.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${u.is_active ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                            {u.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button
                                            onClick={() => toggleStatus(u)}
                                            title={u.is_active ? "Inativar" : "Ativar"}
                                            className={`p-2 rounded transition ${u.is_active ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-green-600'}`}
                                        >
                                            {u.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                                        </button>

                                        <Link href={`/users/edit/${u.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                            <Edit2 size={18} />
                                        </Link>

                                        <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}