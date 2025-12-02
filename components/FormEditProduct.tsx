"use client";
import { useActionState } from "react"; // No Next 14 pode ser useFormState (react-dom)
import { updateProductAction } from "@/app/products/actions"

interface ProductData {
    id: number;
    name: string;
    barcode: string | null;
    category: string | null;
    price: number;
    cost_price: number;
    min_stock: number;
    stock_quantity: number;
}

const initialState = {
    success: false,
    message: null,
};

function SubmitButton() {
    const { pending } = useFormStatus(); // Hook nativo do React
    // Nota: useFormStatus deve ser usado num componente DENTRO do form

    return (
        <button
            type="submit"
            disabled={pending}
            className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition flex items-center gap-2"
        >
            <Save size={18} />
            {pending ? "Salvando..." : "Atualizar Produto"}
        </button>
    );
}

import { useFormStatus } from "react-dom";
import { Save } from "lucide-react";

export default function FormEditProduct({ product }: { product: ProductData }) {
    const [state, formAction] = useActionState(updateProductAction, initialState);

    return (
        <form action={formAction} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <input type="hidden" name="id" value={product.id} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                        defaultValue={product.name}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barras</label>
                    <input
                        type="text"
                        name="barcode"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                        defaultValue={product.barcode || ""}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                    <input
                        type="text"
                        name="category"
                        list="categories"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                        defaultValue={product.category || ""}
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
                        defaultValue={product.price || ""}
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
                        defaultValue={product.cost_price || ""}
                    />
                </div>

                {/* Campo de Estoque Bloqueado */}
                <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Estoque Atual</label>
                    <input
                        type="number"
                        disabled
                        className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                        defaultValue={product.stock_quantity || ""}
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
                        defaultValue={product.min_stock || ""}
                    />
                </div>

            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
                <SubmitButton />
            </div>

        </form>
    );
}