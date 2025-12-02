"use client";
import { useActionState } from "react"; // No Next 14 pode ser useFormState (react-dom)
import { updateUserAction } from "@/app/users/actions"
import { toast } from "sonner";

interface UserData {
    id: number;
    name: string;
    role: string;
    password: string | null;
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
            className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
        >
            {pending ? "Salvando..." : "Salvar Alterações"}
        </button>
    );
}

import { useFormStatus } from "react-dom";

export default function FormEditUser({ user }: { user: UserData }) {
    const [state, formAction] = useActionState(updateUserAction, initialState);

    return (
        <form action={formAction} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            <input type="hidden" name="id" value={user.id} />

            {state.message && !state.success && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    ⚠️ {state.message}
                </div>
            )}

            {/* Dica: O redirect acontece no servidor, mas se quiser mostrar sucesso antes: */}
            {state.success && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                    ✅ Atualizado com sucesso! Redirecionando...
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500"
                    defaultValue={user.name}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <select
                    name="role"
                    className="w-full p-2 border border-gray-300 rounded bg-white"
                    defaultValue={user.role}
                >
                    <option value="seller">Vendedor</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>

            <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
                <label className="block text-sm font-bold text-yellow-800 mb-1">Redefinir Senha</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Deixe em branco para não alterar"
                    className="w-full p-2 border border-yellow-300 rounded focus:ring-yellow-500 bg-white"
                    defaultValue={user.password || ""}
                />
                <p className="text-xs text-yellow-700 mt-1">Preencha apenas se desejar trocar a senha deste usuário.</p>
            </div>
            <SubmitButton />
        </form>
    );
}