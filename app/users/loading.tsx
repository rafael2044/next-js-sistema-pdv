import Link from "next/link";
import { ArrowLeft, Plus, UserCog, Loader2 } from "lucide-react";

export default function Loading() {
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
                            <tr className="flex flex-col items-center justify-center bg-gray-100">
                                <td colSpan={5} className="flex flex-col items-center gap-2 text-blue-600">
                                    <Loader2 className="animate-spin w-10 h-10" />
                                    <span className="font-semibold">Carregando dados...</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}