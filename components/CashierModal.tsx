"use client";
import { useState } from "react";
import api from "@/services/api";
import { Wallet, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CashierModalProps {
    isOpen: boolean;
    onSuccess: () => void; // Função para chamar quando abrir com sucesso
}

export default function CashierModal({ isOpen, onSuccess }: CashierModalProps) {
    const [balance, setBalance] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleOpen = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/cashier/open", {
                initial_balance: parseFloat(balance) || 0,
            });
            toast.success("Caixa aberto com sucesso!");
            onSuccess(); // Avisa o pai que deu certo
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Erro ao abrir caixa");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">

                <div className="flex flex-col items-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Wallet className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Abertura de Caixa</h2>
                    <p className="text-gray-500 text-center mt-2">
                        Informe o fundo de troco para iniciar as vendas.
                    </p>
                </div>

                <form onSubmit={handleOpen} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor em Dinheiro (R$)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                            placeholder="0.00"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md disabled:opacity-70"
                    >
                        {loading ? "Abrindo..." : "ABRIR CAIXA"}
                    </button>
                </form>
            </div>
        </div>
    );
}