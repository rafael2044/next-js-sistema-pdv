"use client";
import { useState } from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Package, Scale } from "lucide-react";
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
        stock_quantity: "1",
        min_stock: "1",
        is_weighted: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (e.target.type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Bloqueia o submit

            // Opcional: Se quiser que o Enter pule para o próximo campo (comportamento estilo Excel)
            const formElement = e.currentTarget as HTMLFormElement;
            const form = formElement.form;
            const index = Array.prototype.indexOf.call(form, e.currentTarget);
            form.elements[index + 1].focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                cost_price: parseFloat(formData.cost_price),
                stock_quantity: parseFloat(formData.stock_quantity) || 1,
                min_stock: parseFloat(formData.min_stock) || 1,
                // Enviar null se barcode/category estiverem vazios
                barcode: formData.barcode || null,
                category: formData.category || null,
                is_weighted: formData.is_weighted // <--- ENVIANDO AO BACKEND

            };

            await api.post("/products/", payload);
            toast.success("Produto cadastrado com sucesso!");

            setFormData({
                name: "",
                barcode: "",
                category: "",
                price: "",
                cost_price: "",
                stock_quantity: "",
                min_stock: "5",
                is_weighted: false,
            });

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
                                onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
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
                                onKeyDown={handleKeyDown}
                            />
                            {/* Datalist para sugestões simples */}
                            <datalist id="categories">
                                <option value="Bebidas" />
                                <option value="Alimentos" />
                                <option value="Limpeza" />
                                <option value="Construção" />
                                <option value="Eletrônicos" />
                                <option value="Bebidas" />
                                <option value="Alimentos" />
                                <option value="Limpeza" />
                                <option value="Construção" />
                                <option value="Eletrônicos" />
                            </datalist>
                        </div>

                        <div className="md:col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center gap-4 transition-all hover:border-blue-300">
                            <div className={`p-2 rounded-full transition-colors ${formData.is_weighted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                <Scale size={24} />
                            </div>
                            <div className="flex-1 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, is_weighted: !prev.is_weighted }))}>
                                <label className="block text-sm font-bold text-gray-800 cursor-pointer select-none">
                                    Produto vendido por Peso (KG)?
                                </label>
                                <p className="text-xs text-gray-500 select-none">Se marcado, o preço será calculado por Quilograma e permitirá decimais.</p>
                            </div>
                            <input
                                type="checkbox"
                                id="is_weighted"
                                name="is_weighted"
                                checked={formData.is_weighted}
                                onChange={handleChange}
                                className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                            />
                        </div>

                        {/* Preço de Venda */}
                        <div>
                            <label className="block text-sm font-medium text-green-700 mb-1">Preço de Venda (R$) *</label>
                            <input
                                type="number"
                                name="price"
                                step="0.5"
                                required
                                className="w-full p-2 border border-green-300 rounded focus:ring-green-500 focus:border-green-500 bg-green-50"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Preço de Custo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$) *</label>
                            <input
                                type="number"
                                name="cost_price"
                                step="0.5"
                                required
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0.00"
                                value={formData.cost_price}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Estoque Inicial */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Inicial</label>
                            <input
                                type="number"
                                name="stock_quantity"
                                min="1"
                                step="1"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1"
                                value={formData.stock_quantity}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                            <p className={(parseFloat(formData.stock_quantity) < parseFloat(formData.min_stock)) ? "text-xs text-red-500 mt-1 font-bold" : "text-xs text-gray-500 mt-1"}>
                                Deve ser maior ou igual ao estoque mínimo.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                            <input
                                type="number"
                                name="min_stock"
                                min="1"
                                step="1"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                                placeholder="1"
                                value={formData.min_stock}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Deve ser maior que 1 unidade.
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
                            disabled={loading || parseFloat(formData.stock_quantity) < parseFloat(formData.min_stock)}
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