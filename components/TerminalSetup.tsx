"use client";
import { useState, useEffect } from "react";
import { Monitor, Save } from "lucide-react";
import Cookies from 'js-cookie';

export default function TerminalSetup() {
    const [isOpen, setIsOpen] = useState(false);
    const [terminalName, setTerminalName] = useState("");

    useEffect(() => {
        // Verifica se já existe configuração
        const stored = Cookies.get("terminal_id");
        if (!stored) {
            setIsOpen(true);
            // Sugere um nome aleatório ou padrão
            setTerminalName(`CAIXA-${Math.floor(Math.random() * 1000)}`);
        }
    }, []);

    const handleSave = () => {
        if (!terminalName.trim()) return;

        Cookies.set("terminal_id", terminalName.toUpperCase());
        setIsOpen(false);
        window.location.reload(); // Recarrega para aplicar o header no Axios e Contextos
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-[99999] backdrop-blur-md">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Monitor className="w-10 h-10 text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">Configuração do Terminal</h2>
                <p className="text-gray-500 mb-6">
                    Este computador ainda não foi identificado. Por favor, dê um nome para este Ponto de Venda.
                </p>

                <input
                    type="text"
                    className="w-full p-4 border-2 border-blue-100 rounded-lg text-xl font-bold text-center text-gray-700 focus:border-blue-500 outline-none uppercase"
                    placeholder="EX: CAIXA-01"
                    value={terminalName}
                    onChange={(e) => setTerminalName(e.target.value)}
                />

                <button
                    onClick={handleSave}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                >
                    <Save size={20} /> SALVAR E INICIAR
                </button>
            </div>
        </div>
    );
}