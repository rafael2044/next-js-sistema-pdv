"use client"
import api from "@/services/api";
import { UserData } from "@/types/";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Edit2, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserActions({ user }: { user: UserData }) {
    const { user: currentUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const toggleStatus = async () => {
        if (user.username === currentUser) {
            toast.error("Você não pode inativar a si mesmo!");
            return;
        }
        try {
            setLoading(true);
            await api.put(`/users/${user.id}`, { is_active: !user.is_active });
            toast.success(`Usuário ${!user.is_active ? 'Ativado' : 'Inativado'}!`);
            router.refresh();
        } catch (error: any) {
            toast.error("Erro ao alterar status");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir este usuário permanentemente?")) return;
        try {
            setLoading(true);
            await api.delete(`/users/${user.id}`);
            toast.success("Usuário excluído!");
            router.refresh();
        } catch (error: any) {
            const msg = error.response?.data?.detail || "Erro ao excluir";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleStatus}
                title={user.is_active ? "Inativar" : "Ativar"}
                className={`p-2 rounded transition ${user.is_active ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-green-600'}`}
                disabled={loading}
            >
                {user.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
            </button>

            <Link href={`/users/edit/${user.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 size={18} />
            </Link>

            <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded" disabled={loading}>
                <Trash2 size={18} />
            </button>
        </>
    );
}