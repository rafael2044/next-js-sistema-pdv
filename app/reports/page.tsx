"use client";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, TrendingUp, AlertTriangle, DollarSign,
    BarChart3, Package, ArrowRight, X, Trophy
} from "lucide-react";

// Tipos
interface DashboardData {
    sales_today: number;
    best_seller: { name: string; quantity: number } | null;
    top_products: { name: string; quantity: number }[];
    low_stock_count: number;
    low_stock_items: { id: number; name: string; stock_quantity: number; min_stock: number }[];
}

export default function ReportsDashboard() {
    const { role } = useAuth();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    // Controle de Modais
    const [showTopProductsModal, setShowTopProductsModal] = useState(false);
    const [showLowStockModal, setShowLowStockModal] = useState(false);

    useEffect(() => {
        if (role !== "admin" && role !== "manager") {
            router.push("/");
            return;
        }
        fetchDashboard();
    }, [role]);

    const fetchDashboard = async () => {
        try {
            const res = await api.get("/reports/dashboard");
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500">Carregando indicadores...</div>;
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* CABEÇALHO */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <BarChart3 /> Painel Gerencial
                            </h1>
                            <p className="text-sm text-gray-500">Visão geral do desempenho do negócio</p>
                        </div>
                    </div>

                    <Link
                        href="/reports/sales"
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition font-medium"
                    >
                        Ver Relatório Detalhado de Vendas <ArrowRight size={18} />
                    </Link>
                </div>

                {/* GRID DE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* CARD 1: VENDAS HOJE */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-64 hover:shadow-md transition">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-green-100 p-3 rounded-lg text-green-600">
                                    <DollarSign size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Hoje</span>
                            </div>
                            <h3 className="text-gray-500 font-medium">Faturamento do Dia</h3>
                            <p className="text-4xl font-extrabold text-gray-800 mt-2">
                                R$ {data.sales_today.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <Link
                            href="/reports/sales"
                            className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 group"
                        >
                            Ver detalhes das vendas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* CARD 2: PRODUTO MAIS VENDIDO */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-64 hover:shadow-md transition">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                                    <Trophy size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Campeão</span>
                            </div>
                            <h3 className="text-gray-500 font-medium">Produto Mais Vendido</h3>

                            {data.best_seller ? (
                                <div className="mt-2">
                                    <p className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight" title={data.best_seller.name}>
                                        {data.best_seller.name}
                                    </p>
                                    <p className="text-sm text-purple-600 mt-1 font-medium">
                                        {data.best_seller.quantity} unidades vendidas
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-400 mt-2 text-sm">Sem dados de vendas ainda.</p>
                            )}
                        </div>

                        <button
                            onClick={() => setShowTopProductsModal(true)}
                            className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-bold flex items-center gap-1 group text-left"
                        >
                            Ver ranking completo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {/* CARD 3: ESTOQUE BAIXO */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-64 hover:shadow-md transition">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${data.low_stock_count > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Alerta</span>
                            </div>
                            <h3 className="text-gray-500 font-medium">Estoque Crítico</h3>
                            <div className="mt-2 flex items-baseline gap-2">
                                <p className={`text-4xl font-extrabold ${data.low_stock_count > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                                    {data.low_stock_count}
                                </p>
                                <span className="text-gray-500">produtos</span>
                            </div>
                            {data.low_stock_count > 0 && (
                                <p className="text-xs text-red-500 mt-1">Abaixo do estoque mínimo</p>
                            )}
                        </div>

                        <button
                            onClick={() => setShowLowStockModal(true)}
                            className="mt-4 text-red-600 hover:text-red-800 text-sm font-bold flex items-center gap-1 group text-left"
                        >
                            Ver lista de reposição <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                </div>
            </div>

            {/* --- MODAL DE TOP PRODUTOS --- */}
            {showTopProductsModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2"><Trophy size={20} /> Top Produtos</h3>
                            <button onClick={() => setShowTopProductsModal(false)} className="hover:bg-white/20 p-1 rounded"><X size={20} /></button>
                        </div>
                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                    <tr>
                                        <th className="p-3">#</th>
                                        <th className="p-3">Produto</th>
                                        <th className="p-3 text-right">Qtd.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data.top_products.map((p, i) => (
                                        <tr key={i} className="hover:bg-purple-50">
                                            <td className="p-3 font-bold text-purple-600">{i + 1}º</td>
                                            <td className="p-3 font-medium text-gray-800">{p.name}</td>
                                            <td className="p-3 text-right font-bold">{p.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL DE ESTOQUE BAIXO --- */}
            {showLowStockModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
                        <div className="bg-red-600 p-4 flex justify-between items-center text-white">
                            <h3 className="font-bold flex items-center gap-2"><AlertTriangle size={20} /> Reposição Necessária</h3>
                            <button onClick={() => setShowLowStockModal(false)} className="hover:bg-white/20 p-1 rounded"><X size={20} /></button>
                        </div>
                        <div className="p-0 max-h-[70vh] overflow-y-auto">
                            {data.low_stock_items.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">Nenhum produto com estoque baixo.</div>
                            ) : (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 uppercase text-xs sticky top-0">
                                        <tr>
                                            <th className="p-3 border-b">Produto</th>
                                            <th className="p-3 border-b text-center">Atual</th>
                                            <th className="p-3 border-b text-center">Mínimo</th>
                                            <th className="p-3 border-b text-center">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.low_stock_items.map((p) => (
                                            <tr key={p.id} className="hover:bg-red-50">
                                                <td className="p-3 font-medium text-gray-800">{p.name}</td>
                                                <td className="p-3 text-center font-bold text-red-600">{p.stock_quantity}</td>
                                                <td className="p-3 text-center text-gray-500">{p.min_stock}</td>
                                                <td className="p-3 text-center">
                                                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">Crítico</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 border-t flex justify-end">
                            <Link href="/stock" className="text-blue-600 text-sm font-bold hover:underline">
                                Ir para Gestão de Estoque
                            </Link>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}