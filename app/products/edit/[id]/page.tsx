"use client";
import { useState, useEffect, use } from "react"; // 'use' para params no Next 13+
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { role, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Unwrap dos params (Next.js 15 requires await on params, or use hook)
    const [productId, setProductId] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        barcode: "",
        category: "",
        price: "",
        cost_price: "",
        min_stock: "",
        stock_quantity: 0, // Apenas leitura
    });

    // Inicialização
    useEffect(() => {
        const init = async () => {
            const resolvedParams = await params;
            setProductId(resolvedParams.id);
            fetchProduct(resolvedParams.id);
        };
        init();
    }, [params]);

    // Busca dados do produto
    const fetchProduct = async (id: string) => {
        try {
            const res = await api.get(`/products/${id}`);
            const p = res.data;
            setFormData({
                name: p.name,
                barcode: p.barcode || "",
                category: p.category || "",
                price: p.price.toString(),
                cost_price: p.cost_price.toString(),
                min_stock: p.min_stock.toString(),
                stock_quantity: p.stock_quantity,
            });
        } catch (error) {
            alert("Erro ao carregar produto.");
            router.push("/");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                name: formData.name,
                barcode: formData.barcode || null,
                category: formData.category || null,
                price: parseFloat(formData.price),
                cost_price: parseFloat(formData.cost_price),
                min_stock: parseFloat(formData.min_stock),
                // Nota: Não enviamos stock_quantity
            };

            await api.put(`/products/${productId}`, payload);
            toast.success("Produto atualizado com sucesso!");
            router.push("/");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.detail || "Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    // Proteção de Rota
    if (!authLoading && role !== "admin" && role !== "manager") {
        return <div className="p-8 text-center">Acesso Negado</div>;
    }

    if (fetching) return <div className="p-8 text-center">Carregando dados...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-2xl">

                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Cancelar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Edit /> Editar Produto
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                            <input
                                type="text"
                                name="barcode"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                                value={formData.barcode}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <input
                                type="text"
                                name="category"
                                list="categories"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                                value={formData.category}
                                onChange={handleChange}
                            />
                            <datalist id="categories">
                                <option value="Bebidas" />
                                <option value="Alimentos" />
                                <option value="Limpeza" />
                                <option value="Construção" />
                            </datalist>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Preço Venda (R$)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                className="w-full p-2 border border-green-300 rounded focus:ring-green-500 bg-green-50"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço Custo (R$)</label>
                            <input
                                type="number"
                                name="cost_price"
                                step="0.01"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                                value={formData.cost_price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Campo de Estoque Bloqueado */}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Estoque Atual</label>
                            <input
                                type="number"
                                disabled
                                className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                                value={formData.stock_quantity}
                            />
                            <p className="text-[10px] text-gray-400 mt-1">Use a função de Reposição para alterar.</p>
                        </div>

                        {/* Estoque Mínimo para alerta */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                            <input
                                type="number"
                                name="min_stock"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                                value={formData.min_stock}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <Save size={18} />
                            {loading ? "Salvando..." : "Atualizar Produto"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}