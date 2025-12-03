// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import TerminalSetup from "@/components/TerminalSetup"; // Importe
import ClientToast from "@/components/ClientToast";
import RouteGuard from "@/components/RouteGuard";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDV System",
  description: "Sistema de Vendas",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <TerminalSetup />
          <RouteGuard>
            {children}
          </RouteGuard>
          <ClientToast />
        </AuthProvider>
      </body>
    </html>
  );
}