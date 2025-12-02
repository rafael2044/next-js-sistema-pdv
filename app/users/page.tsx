import api from "@/services/api";
import Link from "next/link";
import { ArrowLeft, Plus, UserCog } from "lucide-react";
import UserActions from "@/components/UserActions";
import { cookies } from "next/headers"; // Importação nativa do Next
import { UserData } from "@/types";

export default async function UserList() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const terminal_id = cookieStore.get("terminal_id")?.value;

    await new Promise((resolve) => setTimeout(resolve, 3000));
    let res = null;
    try {
        res = await api.get("/users/", {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-terminal-id": terminal_id,
            },
        });
    } catch (error: any) {
        throw Error(error.response?.data?.detail || "Erro ao buscar lista de usuários");
    }
    const users = res?.data;

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
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4">
                                        <div className="flex items-center justify-center">
                                            <span className="font-semibold">Nenhum usuário encontrado</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {users.map((u: UserData) => (
                                <tr key={u.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium">{u.name}</td>
                                    <td className="p-4 text-gray-500">{u.username}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            u.role === 'manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-50 text-gray-600 border-gray-200'
                                            }`}>
                                            {u.role === 'admin' ? 'Administrador' : u.role === 'manager' ? 'Gerente' : 'Vendedor'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${u.is_active ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                            {u.is_active ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <UserActions user={u} />
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