import Link from "next/link";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
            <h2 className="text-6xl font-bold text-red-500">404</h2>
            <p className="text-xl mt-4 text-gray-300">Ops! Produto não encontrado.</p>
            <p className="text-gray-500 mb-8 text-center max-w-md">
                O ID que você procurou não existe na nossa base de dados.
            </p>

            <Link
                href="/products"
                className="px-6 py-3 bg-blue-600 rounded hover:bg-blue-700 transition-colors font-bold"
            >
                Voltar para a Lista
            </Link>
        </main>
    );
}