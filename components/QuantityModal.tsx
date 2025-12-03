"use client";
import { useState, useEffect, useRef } from "react";
import { X, Package, Plus, Scale } from "lucide-react";

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
    is_weighted: boolean;
}

interface QuantityModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (quantity: number) => void;
    product: Product | null;
}

export default function QuantityModal({ isOpen, onClose, onConfirm, product }: QuantityModalProps) {
    const [quantity, setQuantity] = useState("1");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && product) {
            setQuantity(product?.is_weighted ? "0.00" : "1");
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                }
            }, 100);
        }
    }, [isOpen, product]);

    if (!isOpen || !product) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseFloat(quantity);
        if (!qty || qty <= 0) return;

        onConfirm(qty);
    };

    return (
        // CAMADA 1: Overlay (Fundo)
        // z-[9999]: Garante que fique acima de tudo
        // fixed inset-0: Cobre a tela inteira
        // flex items-center justify-center: Centraliza o filho PERFEITAMENTE
        // bg-black/60: Fundo escuro transparente
        // backdrop-blur-sm: O efeito Bloom/Vidro
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            {/* CAMADA 2: O Modal (Caixa Branca) */}
            {/* relative: Para posicionamento interno */}
            {/* w-full max-w-md: Ocupa largura total ATÉ chegar no tamanho médio (aprox 450px) */}
            {/* shadow-2xl: Sombra forte para destacar do fundo */}
            <div
                className="relative bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Cabeçalho Azul */}
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md">
                    <h2 className="font-bold flex items-center gap-2 text-lg">
                        <Package size={22} /> Adicionar Item
                    </h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Corpo do Modal */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Informações do Produto */}
                    <div className="text-center space-y-2">
                        <h3 className="font-bold text-gray-800 text-xl leading-tight">
                            {product.name}
                        </h3>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                            Estoque Disponível: {product.is_weighted ? product.stock_quantity.toFixed(2) : product.stock_quantity} {product.is_weighted && "kg"}
                        </div>
                    </div>

                    {/* Input de Quantidade */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase text-center mb-2 tracking-wide">
                            {product.is_weighted ? (<><Scale size={20} /> Peso KG</>) : "Quantidade"}
                        </label>
                        <div className="relative max-w-[200px] mx-auto">
                            <input
                                ref={inputRef}
                                type="number"
                                step={product.is_weighted ? "0.01" : "1"}
                                min={product.is_weighted ? "0.01" : "1"}
                                className="w-full p-3 text-center text-4xl font-extrabold text-gray-800 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="mt-4 text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <span className="text-blue-600 font-medium">Total:</span>
                            <span className="ml-2 text-xl font-bold text-blue-700">
                                R$ {((parseFloat(quantity) || 0) * product.price).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            <Plus size={20} strokeWidth={3} /> ADICIONAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}