import { useState, useCallback } from "react";

export function useCopy() {
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const copy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            setError(null);

            // Reset copied state after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err: any) {
            setIsCopied(false);
            setError(err?.message || "Gagal menyalin ke clipboard");
        }
    }, []);

    return { copy, isCopied, error };
}
