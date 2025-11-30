"use client";
import { useState, useEffect } from "react";
import { X, DollarSign, CreditCard, Banknote, QrCode, Coins } from "lucide-react";
import { toast } from "sonner";

interface Product {
    id: number;
    name: string;
    price: number;
}

interface CartItem extends Product {
    quantity: number;
}

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (paymentMethod: string) => void;
    total: number;
    cart: CartItem[];
    loading: boolean;
}

export default function CheckoutModal({ isOpen, onClose, onConfirm, total, cart, loading }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState("dinheiro");
    const [cashGiven, setCashGiven] = useState(""); // Valor entregue pelo cliente
    const [change, setChange] = useState(0); // Troco

    // Resetar estados quando abrir
    useEffect(() => {
        if (isOpen) {
            setPaymentMethod("dinheiro");
            setCashGiven("");
            setChange(0);
        }
    }, [isOpen]);

    // Calcular troco em tempo real
    useEffect(() => {
        const cash = parseFloat(cashGiven) || 0;
        setChange(cash - total);
    }, [cashGiven, total]);

    if (!isOpen) return null;

    const handleFinalize = () => {
        // Validação básica se for dinheiro
        if (paymentMethod === "dinheiro") {
            const cash = parseFloat(cashGiven) || 0;
            if (cash < total) {
                toast.error("O valor recebido é menor que o total da venda!");
                return;
            }
        }
        onConfirm(paymentMethod);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <DollarSign /> Finalizar Venda
                    </h2>
                    <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">

                    {/* Lado Esquerdo: Resumo do Carrinho */}
                    <div className="w-1/2 bg-gray-50 p-4 border-r border-gray-200 overflow-y-auto">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">Resumo do Pedido</h3>
                        <ul className="space-y-3">
                            {cart.map((item) => (
                                <li key={item.id} className="flex justify-between text-sm border-b border-gray-200 pb-2">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">{item.name}</span>
                                        <span className="text-gray-500 text-xs">{item.quantity}x R$ {item.price.toFixed(2)}</span>
                                    </div>
                                    <span className="font-semibold text-gray-700">
                                        R$ {(item.quantity * item.price).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-4 flex justify-between items-center text-lg font-bold text-gray-800 border-t pt-4">
                            <span>TOTAL</span>
                            <span>R$ {total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Lado Direito: Pagamento */}
                    <div className="w-1/2 p-6 flex flex-col justify-between">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <button
                                    onClick={() => setPaymentMethod("dinheiro")}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${paymentMethod === 'dinheiro' ? 'bg-green-50 border-green-500 text-green-700' : 'hover:bg-gray-50 border-gray-200'}`}
                                >
                                    <Banknote size={20} /> <span className="text-sm font-medium">Dinheiro</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("debito")}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${paymentMethod === 'debito' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50 border-gray-200'}`}
                                >
                                    <CreditCard size={20} /> <span className="text-sm font-medium">Débito</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("credito")}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${paymentMethod === 'credito' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'hover:bg-gray-50 border-gray-200'}`}
                                >
                                    <CreditCard size={20} /> <span className="text-sm font-medium">Crédito</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod("pix")}
                                    className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition ${paymentMethod === 'pix' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'hover:bg-gray-50 border-gray-200'}`}
                                >
                                    <QrCode size={20} /> <span className="text-sm font-medium">Pix</span>
                                </button>
                            </div>

                            {/* Área Dinâmica: Dinheiro */}
                            {paymentMethod === "dinheiro" && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Valor Recebido</label>
                                        <div className="relative mt-1">
                                            <span className="absolute left-3 top-2.5 text-gray-500 font-bold">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                autoFocus
                                                className="w-full pl-10 p-2 text-xl font-bold text-gray-800 border-b-2 border-yellow-400 bg-transparent focus:outline-none"
                                                placeholder="0.00"
                                                value={cashGiven}
                                                onChange={(e) => setCashGiven(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm font-medium text-gray-600 flex items-center gap-1"><Coins size={16} /> Troco</span>
                                        <span className={`text-xl font-bold ${change < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            R$ {change.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleFinalize}
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                        >
                            {loading ? "Processando..." : "CONFIRMAR PAGAMENTO"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}