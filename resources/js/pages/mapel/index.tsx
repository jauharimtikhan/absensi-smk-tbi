import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import {
    Loader2Icon,
    Plus,
    Settings2,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import React, { useState } from "react";
import MapelCreate from "./create";
import { BaseResponsePagination, PageProps } from "@/types";
import useToast from "@/hooks/useToast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import MapelUpdate from "./update";
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
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";

export type MapelResponseType = {
    id: number;
    kode_mapel: string;
    nama_mapel: string;
    created_at: string;
    updated_at: string;
};
interface MapelIndexProps extends PageProps {
    mapels: BaseResponsePagination<MapelResponseType>;
}
export default function index({ alert, mapels }: MapelIndexProps) {
    useToast(alert);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [updatedData, setUpdatedData] = useState<
        MapelResponseType | undefined
    >(undefined);
    const columns: ColumnDef<MapelResponseType>[] = [
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = mapels.current_page - 1; // 0-based
                const pageSize = mapels.per_page;

                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: "nama_mapel",
            header: "Nama Mata pelajaran",
        },
        {
            accessorKey: "kode_mapel",
            header: "Kode Mata Pelajaran",
        },
        {
            accessorKey: "aksi",
            header: "Aksi",
            cell: ({ row }) => {
                return (
                    <DataTableActionColumn>
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    setUpdatedData(row.original);
                                    setOpenModalUpdate(true);
                                }}
                            >
                                <Settings2 />
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setUpdatedData(row.original);
                                    setOpenModalDelete(true);
                                }}
                            >
                                <Trash2 className="text-red-500" />
                                Hapus
                            </DropdownMenuItem>
                        </>
                    </DataTableActionColumn>
                );
            },
        },
    ];

    const handleDelete = () => {
        if (!updatedData) {
            toast.error("Data mata pelajaran tidak ditemukan!");
            return;
        }
        router.delete(route("mapel.destroy", updatedData.id), {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AuthenticatedLayout title="Mata Pelajaran">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Data Mata Pelajaran</h1>
                <Button
                    type="button"
                    onClick={() => setOpenModalCreate(!openModalCreate)}
                    variant={"secondary"}
                >
                    <Plus />
                    Buat Mapel Baru
                </Button>
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={mapels.data}
                    last_page={mapels.last_page}
                    current_page={mapels.current_page}
                    total={mapels.total}
                    per_page={mapels.per_page}
                    path="mapel.index"
                    links={mapels.links}
                />
            </div>
            <MapelCreate
                visible={openModalCreate}
                onClose={() => setOpenModalCreate(!openModalCreate)}
            />

            <MapelUpdate
                visible={openModalUpdate}
                onClose={() => setOpenModalUpdate(!openModalUpdate)}
                dataMapel={updatedData && updatedData}
            />
            <AlertDialog
                open={openModalDelete}
                onOpenChange={setOpenModalDelete}
            >
                <AlertDialogContent>
                    <div className="flex justify-center">
                        <TriangleAlert className="text-red-500 size-12" />
                    </div>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Apakah anda yakin ingin menghapus data ini?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Anda akan kehilangan data tagihan dan transaksi,
                            Data tidak dapat dipulihkan jika sudah terhapus!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Kembali</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {loading ? (
                                <Loader2Icon className="animate-spin" />
                            ) : null}
                            Ya, Saya yakin
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
