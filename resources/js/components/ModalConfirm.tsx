import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2Icon, TriangleAlert } from "lucide-react";
import useDelete from "@/hooks/useDelete";
import toast from "react-hot-toast";

interface ModalConfirmProps {
    open: boolean;
    onClose?(open: boolean): void;
    title?: string;
    description?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    deleteUrl: string;
    idData?: string | number;
}

export default function ModalConfirm({
    open,
    onClose,
    title = "Apakah anda yakin ingin menghapus data ini?",
    description = " Anda akan kehilangan data tagihan dan transaksi, Data tidak dapat dipulihkan jika sudah terhapus!",
    deleteUrl,
    cancelButtonText = "Kembali",
    confirmButtonText = "Ya, Saya Yakin",
    idData,
}: ModalConfirmProps) {
    const { deleteData, loading, done, error } = useDelete();

    const handleDelete = async () => {
        if (!idData) {
            toast.error(`Data tidak ditemukan!`);
            return;
        }
        await deleteData(route(deleteUrl, idData));
        if (error) toast.error(error);
    };
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <div className="flex justify-center">
                    <TriangleAlert className="text-red-500 size-12" />
                </div>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelButtonText}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                        {loading ? (
                            <Loader2Icon className="animate-spin" />
                        ) : (
                            confirmButtonText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
