export interface UserData {
    id: number;
    name: string;
    username: string;
    role: string;
    is_active: boolean;
}

export interface Product {
    id: number;
    name: string;
    barcode: string | null;
    price: number;
    stock_quantity: number;
    min_stock: number;
    category: string | null;
    is_active: boolean;
}