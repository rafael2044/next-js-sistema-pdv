"use client";
import { useEffect, useState, useRef } from "react";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Database, Download, Upload, Trash2,
    FileJson, RefreshCw, HardDrive, ShieldAlert
} from "lucide-react";
import { toast } from "sonner";

interface Stats {
    products: number;
    users: number;
    sales: number;
    stock_movements: number;
    last_backup: string | null;
}

interface BackupFile {
    filename: string;
    size_kb: number;
    created_at: string;
}

export default function BackupPage() {
    const { role } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<Stats | null>(null);
    const [backups, setBackups] = useState<BackupFile[]>([]);
    const [loading, setLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (role !== "admin") {
            router.push("/");
            return;
        }
        fetchData();
    }, [role]);

    const fetchData = async () => {
        try {
            const [statsRes, filesRes] = await Promise.all([
                api.get("/backup/stats"),
                api.get("/backup/list")
            ]);
            setStats(statsRes.data);
            setBackups(filesRes.data);
        } catch (error) {
            toast.error("Erro ao carregar dados de backup");
        }
    };

    const handleCreateBackup = async () => {
        setLoading(true);
        try {
            await api.post("/backup/create");
            toast.success("Backup criado com sucesso!");
            fetchData();
        } catch (error) {
            toast.error("Erro ao criar backup");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (filename: string) => {
        if (!confirm("Deseja realmente excluir este arquivo de backup?")) return;
        try {
            await api.delete(`/backup/${filename}`);
            toast.success("Arquivo excluído");
            fetchData();
        } catch (error) {
            toast.error("Erro ao excluir");
        }
    };

    const handleDownload = (filename: string) => {
        // Usamos window.open para download direto
        const token = localStorage.getItem("token");
        // Precisamos passar o token de alguma forma ou usar uma request assinada, 
        // mas para simplificar, faremos via fetch blob

        // Método via API Client para enviar Header de Auth
        api.get(`/backup/download/${filename}`, { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            })
            .catch(() => toast.error("Erro no download"));
    };

    const handleRestoreClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("ATENÇÃO: A restauração apagará TODOS os dados atuais e substituirá pelos dados do backup. Deseja continuar?")) {
            e.target.value = ""; // Limpa input
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setLoading(true);
        const loadingToast = toast.loading("Restaurando banco de dados...");

        try {
            await api.post("/backup/restore", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.dismiss(loadingToast);
            toast.success("Restauração completa! O sistema será recarregado.");

            setTimeout(() => {
                window.location.href = "/"; // Recarrega a aplicação
            }, 2000);

        } catch (error: any) {
            toast.dismiss(loadingToast);
            const msg = error.response?.data?.detail || "Erro ao restaurar backup";
            toast.error(msg);
        } finally {
            setLoading(false);
            e.target.value = "";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* CABEÇALHO */}
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/" className="bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-600">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Database /> Backup e Restauração
                        </h1>
                        <p className="text-sm text-gray-500">Gerencie a segurança dos seus dados</p>
                    </div>
                </div>

                {/* ESTATÍSTICAS */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <span className="text-xs text-gray-500 uppercase font-bold">Produtos</span>
                            <p className="text-2xl font-bold text-gray-800">{stats.products}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                            <span className="text-xs text-gray-500 uppercase font-bold">Usuários</span>
                            <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                            <span className="text-xs text-gray-500 uppercase font-bold">Vendas Totais</span>
                            <p className="text-2xl font-bold text-gray-800">{stats.sales}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-orange-500">
                            <span className="text-xs text-gray-500 uppercase font-bold">Movimentações</span>
                            <p className="text-2xl font-bold text-gray-800">{stats.stock_movements}</p>
                        </div>
                    </div>
                )}

                {/* PAINEL DE AÇÃO */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <HardDrive size={20} /> Operações
                    </h2>

                    <div className="flex flex-col md:flex-row gap-4">
                        <button
                            onClick={handleCreateBackup}
                            disabled={loading}
                            className="flex-1 bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition flex flex-col items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            <Download size={32} />
                            <span className="font-bold text-lg">CRIAR NOVO BACKUP</span>
                            <span className="text-xs opacity-80">Salvar estado atual do sistema</span>
                        </button>

                        <div className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition cursor-pointer" onClick={handleRestoreClick}>
                            <Upload size={32} className="text-gray-500" />
                            <span className="font-bold text-lg text-gray-700">RESTAURAR SISTEMA</span>
                            <span className="text-xs text-gray-500 text-center">Clique para enviar um arquivo .json</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".json"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>

                    {stats?.last_backup && (
                        <div className="mt-4 text-center text-sm text-gray-500">
                            Último backup detectado no servidor: <strong>{stats.last_backup}</strong>
                        </div>
                    )}
                </div>

                {/* LISTA DE BACKUPS */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 flex justify-between items-center">
                        <span>Histórico de Backups Locais</span>
                        <button onClick={fetchData} title="Atualizar Lista"><RefreshCw size={16} /></button>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-gray-500 border-b">
                            <tr>
                                <th className="p-4">Arquivo</th>
                                <th className="p-4">Data Criação</th>
                                <th className="p-4">Tamanho</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {backups.length === 0 ? (
                                <tr><td colSpan={4} className="p-8 text-center text-gray-400">Nenhum backup encontrado.</td></tr>
                            ) : (
                                backups.map((file) => (
                                    <tr key={file.filename} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-blue-600 flex items-center gap-2">
                                            <FileJson size={16} /> {file.filename}
                                        </td>
                                        <td className="p-4 text-gray-600">{file.created_at}</td>
                                        <td className="p-4 text-gray-600">{file.size_kb} KB</td>
                                        <td className="p-4 flex justify-end gap-2">
                                            <button
                                                onClick={() => handleDownload(file.filename)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                                                title="Baixar para seu computador"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.filename)}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded"
                                                title="Excluir do servidor"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}