import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { Plus, Settings2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import JurusanCreate from "./create";
import { BaseResponsePagination, PageProps } from "@/types";
import useToast from "@/hooks/useToast";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import JurusanUpdate from "./update";
import ModalConfirm from "@/components/ModalConfirm";

type JurusanResponseType = {
    id: number;
    nama_jurusan: string;
    kode_jurusan: string;
    created_at: string;
    updated_at: string;
};

interface JurusanIndexProps extends PageProps {
    jurusans: BaseResponsePagination<JurusanResponseType>;
}

export default function JurusanIndex({ alert, jurusans }: JurusanIndexProps) {
    useToast(alert);
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [updatedData, setUpdatedData] = useState<
        JurusanResponseType | undefined
    >(undefined);

    const columns: ColumnDef<JurusanResponseType>[] = [
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = jurusans.current_page - 1; // 0-based
                const pageSize = jurusans.per_page;

                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: "nama_jurusan",
            header: "Nama Jurusan",
        },
        {
            accessorKey: "kode_jurusan",
            header: "Kode Jurusan",
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
        <AuthenticatedLayout title="Jurusan">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Data Jurusan</h1>
                <Button
                    type="button"
                    onClick={() => setOpenModalCreate(!openModalCreate)}
                    variant={"secondary"}
                >
                    <Plus />
                    Buat Jurusan Baru
                </Button>
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={jurusans.data}
                    last_page={jurusans.last_page}
                    current_page={jurusans.current_page}
                    total={jurusans.total}
                    per_page={jurusans.per_page}
                    path="jurusan.index"
                    links={jurusans.links}
                />
            </div>

            <JurusanCreate
                visible={openModalCreate}
                onClose={() => setOpenModalCreate(!openModalCreate)}
            />
            <JurusanUpdate
                visible={openModalUpdate}
                onClose={() => setOpenModalUpdate(!openModalUpdate)}
                dataJurusan={updatedData}
            />

            <ModalConfirm
                open={openModalDelete}
                onClose={setOpenModalDelete}
                deleteUrl="jurusan.destroy"
                idData={updatedData?.id}
            />
        </AuthenticatedLayout>
    );
}
