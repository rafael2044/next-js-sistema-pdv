
import api from "@/services/api";
import Link from "next/link";
import {
    ArrowLeft,
    Plus,
    Package,
} from "lucide-react";
import ProductActions from "@/components/ProductActions";
import { cookies } from "next/headers";
import { Product } from "@/types";


export default async function ProductList() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const resp = await api.get("/products/", { headers: { Authorization: `Bearer ${token}` } });
    const products = resp.data;

    // const [search, setSearch] = useState("");



    // // Filtro de busca
    // const filteredProducts = products.filter((p) =>
    //     p.name.toLowerCase().includes(search.toLowerCase()) ||
    //     (p.barcode && p.barcode.includes(search))
    // );

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
                            <p className="text-sm text-gray-500">{products.length} itens cadastrados</p>
                        </div>
                    </div>

                    <Link
                        href="/products/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition"
                    >
                        <Plus size={20} /> Novo Produto
                    </Link>
                </div>

                {/* Barra de Ferramentas (Busca) */}
                {/* <div className="bg-white p-4 rounded-t-lg border-b border-gray-200 flex items-center gap-2">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou código de barras..."
                        className="flex-1 outline-none text-gray-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div> */}

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
                            {products.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhum produto encontrado.</td></tr>
                            ) : (
                                products.map((product: Product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition">
                                        <td className="p-4 text-gray-500">#{product.id}</td>
                                        <td className="p-4 font-medium text-gray-800">
                                            {product.name}
                                            {product.barcode && <span className="block text-xs text-gray-400">{product.barcode}</span>}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                {product.category || "Geral"}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-gray-800">R$ {product.price.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${product.stock_quantity > 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                                {product.stock_quantity} un
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold`}>
                                                {product.min_stock} un
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                                {product.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 flex justify-center gap-2">
                                            <ProductActions product={product} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}