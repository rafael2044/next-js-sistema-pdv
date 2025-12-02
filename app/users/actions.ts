"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import api from "@/services/api";

export type actionState = {
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
}

export async function updateUserAction(prevState: actionState, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const payload: any = { name: formData.get('name'), role: formData.get('role') };
    if (formData.get('password')) payload.password = formData.get('password');
    let redirectPath = null; // Variável auxiliar
    try {
        const resp = await api.put(`/users/${formData.get('id')}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        if (!(resp.status === 200)) {
            return {
                success: false,
                message: resp.data.detail,
            }
        }
        redirectPath = "/users";
        revalidatePath("/users");
    } catch (err: any) {
        return {
            success: false,
            message: err.response?.data?.detail || "Erro ao atualizar",
        }
    }
    if (redirectPath) {
        redirect(redirectPath);
    }
    return {
        success: true,
        message: "Usuário atualizado com sucesso!",
    };
};