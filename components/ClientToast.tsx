"use client";

import { Toaster } from "sonner";

export default function ClientToaster() {
    return (
        <Toaster
            richColors
            position="top-center"
            duration={2000}
            // AQUI ESTÁ O SEGREDO: Forçamos um z-index altíssimo no style
            toastOptions={{
                style: { zIndex: 99999 }
            }}
        />
    );
}