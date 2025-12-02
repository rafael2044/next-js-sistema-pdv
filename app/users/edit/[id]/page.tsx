import api from "@/services/api";
import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import { cookies } from "next/headers";
import UserForm from "@/components/FormEditUser";
import { notFound } from "next/navigation";

export default async function EditUser({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const terminal_id = cookieStore.get("terminal_id")?.value;
    let res;
    try {
        res = await api.get(`/users/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "x-terminal-id": terminal_id,
            },
        });
    } catch (error: any) {
        if (error.response?.status === 404) {
            notFound();
        } else {
            throw new Error(error.response?.data?.detail);
        }
    }
    const user = res.data;
    if (!user) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
            <div className="w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                    <Link href="/users" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft size={20} /> Voltar
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <UserCog /> Editar Usuário
                    </h1>
                </div>
                <UserForm user={user} />
            </div>
        </div>
    );
}