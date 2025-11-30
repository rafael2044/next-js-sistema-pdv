// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import TerminalSetup from "@/components/TerminalSetup"; // Importe
import ClientToast from "@/components/ClientToast";

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
          {children}
          <ClientToast />
        </AuthProvider>
      </body>
    </html>
  );
}