import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/raw-table";
import { Checkbox } from "@/components/ui/checkbox";
import type { BaseResponsePagination } from "@/types";
import { SiswaResponseType } from "../siswa";

interface SiswaTableProps {
    dataSiswa: BaseResponsePagination<SiswaResponseType>;
    selectedSiswaIds: number[];
    onSelectionChange: (selectedIds: number[]) => void;
    onPageChange: (page: number) => void;
}

const SiswaTable = React.memo(
    ({
        dataSiswa,
        selectedSiswaIds,
        onSelectionChange,
        onPageChange,
    }: SiswaTableProps) => {
        const currentPageIds = useMemo(
            () => dataSiswa.data.map((siswa) => siswa.id),
            [dataSiswa.data]
        );

        const handleSelectAll = (checked: boolean) => {
            if (checked) {
                const newSelected = [
                    ...new Set([...selectedSiswaIds, ...currentPageIds]),
                ];
                onSelectionChange(newSelected);
            } else {
                const newSelected = selectedSiswaIds.filter(
                    (id) => !currentPageIds.includes(id)
                );
                onSelectionChange(newSelected);
            }
        };

        const handleRowSelection = (siswaId: number, checked: boolean) => {
            const newSelected = checked
                ? [...selectedSiswaIds, siswaId]
                : selectedSiswaIds.filter((id) => id !== siswaId);

            onSelectionChange(newSelected);
        };

        const columns = useMemo<ColumnDef<SiswaResponseType>[]>(
            () => [
                {
                    id: "rowNumber",
                    header: "No.",
                    cell: ({ row }) => (
                        <div className="text-right">
                            {row.index +
                                1 +
                                (dataSiswa.current_page - 1) *
                                    dataSiswa.per_page}
                        </div>
                    ),
                    size: 50,
                },
                {
                    accessorKey: "nis",
                    header: "NIS",
                    size: 100,
                },
                {
                    accessorKey: "nama_lengkap",
                    header: "Nama Lengkap",
                    size: 250,
                },
                {
                    id: "selection",
                    header: () => {
                        const allSelected = currentPageIds.every((id) =>
                            selectedSiswaIds.includes(id)
                        );

                        return (
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={handleSelectAll}
                                aria-label="Select all"
                            />
                        );
                    },
                    size: 50,
                    cell: ({ row }) => {
                        const siswaId = row.original.id;
                        const isSelected = selectedSiswaIds.includes(siswaId);

                        return (
                            <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                    handleRowSelection(siswaId, !!checked)
                                }
                                aria-label={`Select ${row.original.nama_lengkap}`}
                            />
                        );
                    },
                },
            ],
            [dataSiswa, selectedSiswaIds, currentPageIds]
        );

        return (
            <DataTable
                data={dataSiswa.data}
                columns={columns}
                links={dataSiswa.links}
                current_page={dataSiswa.current_page}
                last_page={dataSiswa.last_page}
                total={dataSiswa.total}
                per_page={dataSiswa.per_page}
                handlePageChange={onPageChange}
            />
        );
    }
);
export default SiswaTable;
