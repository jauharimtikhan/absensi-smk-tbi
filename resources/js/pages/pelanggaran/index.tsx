import ButtonForm from "@/components/button-form";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { BaseResponsePagination, PageProps, User } from "@/types";
import { Plus, Settings2, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { OptionsSelect2 } from "../absensi/absensiTypes";
import useToast from "@/hooks/useToast";
import { SiswaResponseType } from "../siswa";
import { ColumnDef } from "@tanstack/react-table";
import PelanggaranCreateModal from "./create";
import { DataTable, DataTableActionColumn } from "@/components/raw-table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import PelanggaranUpdateModal from "./update";
import ModalConfirm from "@/components/ModalConfirm";

export type PelanggaranItemType = {
    id: number;
    keterangan_pelanggaran: string;
    tindakan_pelanggaran: string;
    tanggal: string;
    siswa: SiswaResponseType;
    guru: User;
    siswa_id: number;
    guru_id: number;
};

interface PelanggaranPageProps extends PageProps {
    siswas: OptionsSelect2[];
    pelanggarans: BaseResponsePagination<PelanggaranItemType>;
}

export type ModalPelangaranPageState = {
    add: boolean;
    update: boolean;
    delete: boolean;
};

export default function PelanggaranPage({
    alert,
    pelanggarans,
    siswas,
}: PelanggaranPageProps) {
    useToast(alert);
    const [showModal, setShowModal] = useState<ModalPelangaranPageState>({
        add: false,
        update: false,
        delete: false,
    });
    const [selectedPelanggaran, setSelectedPelanggaran] =
        useState<PelanggaranItemType | null>(null);

    const columns: ColumnDef<PelanggaranItemType>[] = [
        {
            id: "rowNumber",
            header: "No. ",
            cell: ({ row }) => {
                const pageIndex = pelanggarans.current_page - 1; // 0-based
                const pageSize = pelanggarans.per_page;

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
            accessorKey: "aksi",
            header: "Aksi",
            cell: ({ row }) => {
                return (
                    <DataTableActionColumn>
                        <>
                            <DropdownMenuItem
                                onClick={() => {
                                    setSelectedPelanggaran(row.original);
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
                                    setSelectedPelanggaran(row.original);
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
        <AuthenticatedLayout title="Pelanggaran Siswa">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <h1>Data Pelanggaran Siswa</h1>
                <ButtonForm
                    onClick={() =>
                        setShowModal({
                            ...showModal,
                            add: true,
                        })
                    }
                    label="Tambah Data Pelanggaran"
                    righticon={<Plus />}
                    className="lg:w-fit lg:justify-self-end"
                />
            </div>
            <div className="mt-6">
                <DataTable
                    columns={columns}
                    data={pelanggarans.data}
                    links={pelanggarans.links}
                    current_page={pelanggarans.current_page}
                    last_page={pelanggarans.last_page}
                    path="pelanggaran.index"
                    total={pelanggarans.total}
                />
            </div>
            <PelanggaranCreateModal
                open={showModal.add}
                onClose={() =>
                    setShowModal({
                        ...showModal,
                        add: false,
                    })
                }
                siswas={siswas}
            />

            {!selectedPelanggaran ? null : (
                <>
                    <PelanggaranUpdateModal
                        siswas={siswas}
                        pelanggaran={selectedPelanggaran}
                        open={showModal.update}
                        onClose={() =>
                            setShowModal({
                                ...showModal,
                                update: false,
                            })
                        }
                    />
                    <ModalConfirm
                        open={showModal.delete}
                        onClose={() =>
                            setShowModal({
                                ...showModal,
                                delete: false,
                            })
                        }
                        deleteUrl="pelanggaran.destroy"
                        idData={selectedPelanggaran.id}
                    />
                </>
            )}
        </AuthenticatedLayout>
    );
}
