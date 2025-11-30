"use client";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CreateProduct() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        barcode: "",
        category: "",
        price: "",
        cost_price: "",
        stock_quantity: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convertendo strings para números conforme o Pydantic espera
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                cost_price: parseFloat(formData.cost_price),
                stock_quantity: parseFloat(formData.stock_quantity) || 0,
                // Enviar null se barcode/category estiverem vazios
                barcode: formData.barcode || null,
                category: formData.category || null,
            };

            await api.post("/products/", payload);
            toast.success("Produto cadastrado com sucesso!");
            router.push("/"); // Volta para o PDV ou limpa o form
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.detail || "Erro ao cadastrar produto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-2xl">

                {/* Cabeçalho */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar ao PDV
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <Package /> Novo Produto
                    </h1>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nome (Ocupa 2 colunas) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Coca-Cola 2L"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Código de Barras */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                            <input
                                type="text"
                                name="barcode"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Escaneie ou digite"
                                value={formData.barcode}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Categoria */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                            <input
                                type="text"
                                name="category"
                                list="categories"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Ex: Bebidas"
                                value={formData.category}
                                onChange={handleChange}
                            />
                            {/* Datalist para sugestões simples */}
                            <datalist id="categories">
                                <option value="Bebidas" />
                                <option value="Alimentos" />
                                <option value="Limpeza" />
                                <option value="Construção" />
                            </datalist>
                        </div>

                        {/* Preço de Venda */}
                        <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Preço de Venda (R$) *</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                className="w-full p-2 border border-green-300 rounded focus:ring-green-500 focus:border-green-500 bg-green-50"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Preço de Custo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$) *</label>
                            <input
                                type="number"
                                name="cost_price"
                                step="0.01"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                                value={formData.cost_price}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Estoque Inicial */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                step="0.001"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Deixe em branco ou 0 se não tiver estoque no momento.
                            </p>
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
                            {loading ? "Salvando..." : "Salvar Produto"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}