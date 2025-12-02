
import { Loader2 } from "lucide-react";
import { Package } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Search } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">

                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Package /> Produtos
                            </h1>
                            <p className="text-sm text-gray-500"></p>
                        </div>

                    </div>
                </div>

                {/* Barra de Ferramentas (Busca) */}
                <div className="bg-white p-4 rounded-t-lg border-b border-gray-200 flex items-center gap-2">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou código de barras..."
                        className="flex-1 outline-none text-gray-700"
                    />
                </div>

                {/* Tabela */}
                <div className="bg-white shadow-sm rounded-b-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
                            <tr>
                                <th className="p-4 border-b">ID</th>
                                <th className="p-4 border-b">Produto</th>
                                <th className="p-4 border-b">Categoria</th>
                                <th className="p-4 border-b">Preço</th>
                                <th className="p-4 border-b">Estoque</th>
                                <th className="p-4 border-b">Estoque Mínimo</th>
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