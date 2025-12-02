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

export async function updateProductAction(prevState: actionState, formData: FormData) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const payload = {
        name: formData.get("name") as string,
        barcode: formData.get("barcode") || null,
        category: formData.get("category") || null,
        price: parseFloat(formData.get("price") as string),
        cost_price: parseFloat(formData.get("cost_price") as string),
        min_stock: parseFloat(formData.get("min_stock") as string),
        // Nota: Não enviamos stock_quantity
    };

    let redirectPath = null; // Variável auxiliar
    try {
        const resp = await api.put(`/products/${formData.get('id')}`, payload, { headers: { Authorization: `Bearer ${token}` } });
        if (!(resp.status === 200)) {
            return {
                success: false,
                message: resp.data.detail,
            }
        }
        redirectPath = "/products";
        revalidatePath("/products");
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
        message: "Produto atualizado com sucesso!",
    };
};