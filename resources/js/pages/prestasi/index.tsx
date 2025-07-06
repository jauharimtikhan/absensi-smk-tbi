import ButtonForm from "@/components/button-form";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { BaseResponsePagination, PageProps } from "@/types";
import { Plus, Settings2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { OptionsSelect2 } from "../absensi/absensiTypes";
import PrestasiCreateModal from "./create";
import { SiswaResponseType } from "../siswa";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import PrestasiUpdateModal from "./update";
import ModalConfirm from "@/components/ModalConfirm";

export type PrestasiItemType = {
    id: number;
    nama: string;
    keterangan: string;
    tanggal: string;
    tingkat: string;
    siswa_id: number;
    siswa: SiswaResponseType;
    created_at: string;
    updated_at: string;
};

interface PrestasiPageProps extends PageProps {
    siswas: OptionsSelect2[];
    prestasis: BaseResponsePagination<PrestasiItemType>;
}
export type ModalPrestasiPageState = {
    add: boolean;
    update: boolean;
    delete: boolean;
};

export default function PrestasiPage({
    alert,
    siswas,
    prestasis,
}: PrestasiPageProps) {
    useToast(alert);

    const [showModal, setShowModal] = useState<ModalPrestasiPageState>({
        add: false,
        update: false,
        delete: false,
    });

    const [selectedPrestasi, setSelectedPrestasi] =
        useState<PrestasiItemType | null>(null);

    const columns: ColumnDef<PrestasiItemType>[] = [
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = prestasis.current_page - 1; // 0-based
                const pageSize = prestasis.per_page;

                return pageIndex * pageSize + row.index + 1;
            },
        },
        {
            accessorKey: "siswa.nis",
            header: "NIS Siswa",
        },
        {
            accessorKey: "siswa.nama_lengkap",
            header: "Nama Siswa",
        },
        {
            accessorKey: "nama",
            header: "Nama Prestasi",
        },
        {
            accessorKey: "tingkat",
            header: "Tingkat Prestasi",
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
                                    setSelectedPrestasi(row.original);
                                    setShowModal({
                                        ...showModal,
                                        update: true,
                                    });
                                }}
                            >
                                <Settings2 />
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedPrestasi(row.original);
                                    setShowModal({
                                        ...showModal,
                                        delete: true,
                                    });
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
        <AuthenticatedLayout title="Prestasi Siswa">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <h1>Data Siswa Berprestasi</h1>
                <ButtonForm
                    className="lg:w-fit lg:justify-self-end"
                    label="Tambah Data Prestasi"
                    type="button"
                    righticon={<Plus />}
                    onClick={() =>
                        setShowModal({
                            ...showModal,
                            add: !showModal.add,
                        })
                    }
                />
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={prestasis.data}
                    links={prestasis.links}
                    current_page={prestasis.current_page}
                    last_page={prestasis.last_page}
                    path="prestasi.index"
                    total={prestasis.total}
                />
            </div>

            <PrestasiCreateModal
                open={showModal.add}
                onClose={() =>
                    setShowModal({
                        ...showModal,
                        add: false,
                    })
                }
                siswas={siswas}
            />
            {!selectedPrestasi ? null : (
                <>
                    <PrestasiUpdateModal
                        open={showModal.update}
                        onClose={() =>
                            setShowModal({
                                ...showModal,
                                update: false,
                            })
                        }
                        siswas={siswas}
                        prestasi={selectedPrestasi}
                    />

                    <ModalConfirm
                        open={showModal.delete}
                        onClose={() =>
                            setShowModal({
                                ...showModal,
                                delete: false,
                            })
                        }
                        deleteUrl="prestasi.destroy"
                        idData={selectedPrestasi.id}
                    />
                </>
            )}
        </AuthenticatedLayout>
    );
}
