"use client";
import { useState } from "react";
import { Monitor, Save, X, AlertTriangle } from "lucide-react";

interface ChangeTerminalModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentName: string;
}

export default function ChangeTerminalModal({ isOpen, onClose, currentName }: ChangeTerminalModalProps) {
    const [newName, setNewName] = useState(currentName);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!newName.trim()) return;

        if (confirm(`Tem certeza que deseja alterar este terminal de "${currentName}" para "${newName.toUpperCase()}"?`)) {
            // Salva no LocalStorage
            localStorage.setItem("terminal_id", newName.toUpperCase());
            // Recarrega a página para aplicar a mudança nos headers da API
            window.location.reload();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Monitor className="text-blue-600" /> Configurar Terminal
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex gap-2">
                        <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                        <p className="text-sm text-yellow-700">
                            Alterar o ID muda a identidade desta máquina. Certifique-se de que o caixa esteja fechado antes de prosseguir.
                        </p>
                    </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Terminal
                </label>
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold text-gray-700"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="EX: CAIXA-01"
                />

                <div className="mt-6 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> Salvar
                    </button>
                </div>
            </div>
        </div>
    );
}