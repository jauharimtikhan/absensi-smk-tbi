import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { Plus, Settings2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import KelasCreate from "./create";
import { BaseResponsePagination, PageProps } from "@/types";
import useToast from "@/hooks/useToast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import KelasUpdate from "./update";
import ModalConfirm from "@/components/ModalConfirm";

export type KelasResponseType = {
    id: number;
    nama_kelas: string;
    kode_kelas: string;
    created_at: string;
    updated_at: string;
};

interface KelasIndexProps extends PageProps {
    kelases: BaseResponsePagination<KelasResponseType>;
}

export default function KelasIndex({ alert, kelases }: KelasIndexProps) {
    useToast(alert);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [updatedData, setUpdatedData] = useState<
        KelasResponseType | undefined
    >(undefined);

    const columns: ColumnDef<KelasResponseType>[] = [
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = kelases.current_page - 1; // 0-based
                const pageSize = kelases.per_page;

                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: "nama_kelas",
            header: "Nama Kelas",
        },
        {
            accessorKey: "kode_kelas",
            header: "Kode Kelas",
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

    return (
        <AuthenticatedLayout title="Kelas">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Data Kelas</h1>
                <Button
                    type="button"
                    onClick={() => setOpenModalCreate(!openModalCreate)}
                    variant={"secondary"}
                >
                    <Plus />
                    Buat Kelas Baru
                </Button>
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={kelases.data}
                    last_page={kelases.last_page}
                    current_page={kelases.current_page}
                    total={kelases.total}
                    per_page={kelases.per_page}
                    links={kelases.links}
                />
            </div>

            <KelasCreate
                visible={openModalCreate}
                onClose={() => setOpenModalCreate(!openModalCreate)}
            />
            <KelasUpdate
                visible={openModalUpdate}
                onClose={() => setOpenModalUpdate(!openModalUpdate)}
                dataKelas={updatedData}
            />

            <ModalConfirm
                open={openModalDelete}
                onClose={setOpenModalDelete}
                deleteUrl="kelas.destroy"
                idData={updatedData?.id}
            />
        </AuthenticatedLayout>
    );
}
