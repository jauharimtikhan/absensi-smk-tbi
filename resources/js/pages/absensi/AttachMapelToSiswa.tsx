import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SiswaResponseType } from "../siswa";
import { ColumnDef } from "@tanstack/react-table";
import { BaseResponsePagination } from "@/types";
import { DataTable } from "@/components/raw-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "@inertiajs/react";

interface AttachMapelToSiswaProps {
    id_kelas: number;
    id_mapel: number;
    returnData: (returnData: number[]) => void;
}

type FormDataAttachSiswa = {
    selected_siswa: number[];
};

export default function AttachMapelToSiswa({
    id_kelas,
    id_mapel,
    returnData,
}: AttachMapelToSiswaProps) {
    const [dataSiswa, setDataSiswa] = useState<
        BaseResponsePagination<SiswaResponseType> | undefined
    >(undefined);
    const [loading, setLoading] = useState(false);
    const [selectedSiswaIds, setSelectedSiswaIds] = useState<number[]>([]);

    const { setData: setFormData } = useForm<FormDataAttachSiswa>({
        selected_siswa: [],
    });

    const fetchData = useCallback(
        async (page?: number) => {
            setLoading(true);
            try {
                const res = await window.axios.get(
                    route("absensi.search.siswa.raw"),
                    {
                        params: {
                            kelas: id_kelas,
                            page: page,
                        },
                    }
                );

                if (res.status === 200) {
                    setDataSiswa(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching siswa data:", error);
            } finally {
                setLoading(false);
            }
        },
        [id_kelas]
    );

    // Handle selection changes
    const handleSelectionChange = useCallback(
        (selectedIds: number[]) => {
            setSelectedSiswaIds(selectedIds);
            setFormData("selected_siswa", selectedIds);
            returnData(selectedIds);
        },
        [returnData, setFormData]
    );

    // Handle select all in current page
    const handleSelectAll = useCallback(
        (currentPageIds: number[]) => {
            const allSelected = selectedSiswaIds
                .filter((id) => !currentPageIds.includes(id))
                .concat(currentPageIds);
            handleSelectionChange(allSelected);
        },
        [selectedSiswaIds, handleSelectionChange]
    );

    // Handle deselect all in current page
    const handleDeselectAll = useCallback(
        (currentPageIds: number[]) => {
            const remainingSelected = selectedSiswaIds.filter(
                (id) => !currentPageIds.includes(id)
            );
            handleSelectionChange(remainingSelected);
        },
        [selectedSiswaIds, handleSelectionChange]
    );

    // Handle individual selection
    const handleRowSelection = useCallback(
        (siswaId: number, isSelected: boolean) => {
            const newSelected = isSelected
                ? [...selectedSiswaIds, siswaId]
                : selectedSiswaIds.filter((id) => id !== siswaId);
            handleSelectionChange(newSelected);
        },
        [selectedSiswaIds, handleSelectionChange]
    );

    const columns = useMemo<ColumnDef<SiswaResponseType>[]>(() => {
        return [
            {
                id: "rowNumber",
                header: "No.",
                cell: ({ row }) => {
                    if (!dataSiswa) return "-";
                    const pageIndex = dataSiswa.current_page - 1;
                    const pageSize = dataSiswa.per_page;
                    return pageIndex * pageSize + row.index + 1;
                },
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
                id: "aksi",
                header: ({ table }) => {
                    const currentPageIds = table
                        .getRowModel()
                        .rows.map((row) => row.original.id);

                    const allSelected = currentPageIds.every((id) =>
                        selectedSiswaIds.includes(id)
                    );
                    const someSelected = currentPageIds.some((id) =>
                        selectedSiswaIds.includes(id)
                    );

                    return (
                        <Checkbox
                            checked={allSelected}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    handleSelectAll(currentPageIds);
                                } else {
                                    handleDeselectAll(currentPageIds);
                                }
                            }}
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
                            onCheckedChange={(checked) => {
                                handleRowSelection(siswaId, !!checked);
                            }}
                            aria-label="Select row"
                        />
                    );
                },
            },
        ];
    }, [
        dataSiswa,
        selectedSiswaIds,
        handleSelectAll,
        handleDeselectAll,
        handleRowSelection,
    ]);

    const handlePageChange = useCallback(
        (page: number) => {
            fetchData(page);
        },
        [fetchData]
    );

    useEffect(() => {
        if (id_kelas) {
            fetchData();
        }
    }, [id_kelas, id_mapel, fetchData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Input Siswa ke Kelas dan Mata Pelajaran</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-[250px] w-full rounded-xl" />
                ) : dataSiswa && dataSiswa.data.length > 0 ? (
                    <DataTable
                        data={dataSiswa.data}
                        columns={columns}
                        links={dataSiswa.links}
                        current_page={dataSiswa.current_page}
                        path="absensi.search.siswa.raw"
                        last_page={dataSiswa.last_page}
                        total={dataSiswa.total}
                        per_page={dataSiswa.per_page}
                        isJson={true}
                        handlePageChange={handlePageChange}
                    />
                ) : (
                    <div className="text-center text-sm text-muted-foreground py-10">
                        Tidak ada data siswa yang ditemukan untuk kelas ini.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
