import { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";

type UseDeleteReturn = {
    deleteData: (url: string) => Promise<void>;
    loading: boolean;
    done: boolean;
    error: string | null;
};

export default function useDelete(): UseDeleteReturn {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteData = async (url: string) => {
        setLoading(true);
        setDone(false);
        setError(null);
        router.delete(url, {
            onStart: () => {
                setLoading(true);
                setDone(false);
                setError(null);
            },
            onFinish: () => {
                setLoading(false);
            },
            onError: (error) => setError(error.result),
        });
    };

    return { deleteData, loading, done, error };
}
