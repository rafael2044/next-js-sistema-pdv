"use client"
import api from "@/services/api";
import { Product } from "@/types/";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Trash2, Edit2, UserCheck, UserX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProductActions({ product }: { product: Product }) {

    const { user: currentUser } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) return;

        try {
            setLoading(true);
            await api.delete(`/products/${product.id}`);
            toast.success("Produto excluído com sucesso!");
            router.refresh();
        } catch (error: any) {
            const msg = error.response?.data?.detail || "Erro ao excluir produto";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async () => {
        try {
            const newStatus = !product.is_active;
            setLoading(true);
            const payload = {
                ...product,
                is_active: newStatus
            };

            await api.put(`/products/${product.id}`, payload);

            toast.success(`Produto ${newStatus ? 'Ativado' : 'Desativado'}!`);
            router.refresh();

        } catch (error) {
            toast.error("Erro ao alterar status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={toggleStatus}
                title={product.is_active ? "Inativar" : "Ativar"}
                className={`p-2 rounded transition ${product.is_active ? 'text-gray-400 hover:text-red-600' : 'text-gray-400 hover:text-green-600'}`}
                disabled={loading}
            >
                {product.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
            </button>

            <Link href={`/products/edit/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                <Edit2 size={18} />
            </Link>

            <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-50 rounded" disabled={loading}>
                <Trash2 size={18} />
            </button>
        </>
    );
}