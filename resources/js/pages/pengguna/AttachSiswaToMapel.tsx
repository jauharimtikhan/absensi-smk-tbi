import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import type { BaseResponsePagination } from "@/types";
import { SiswaResponseType } from "../siswa";
import SiswaTable from "./SiswaTable";

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
    const [dataSiswa, setDataSiswa] =
        useState<BaseResponsePagination<SiswaResponseType>>();
    const [loading, setLoading] = useState(false);
    const [selectedSiswaIds, setSelectedSiswaIds] = useState<number[]>([]);

    const { setData: setFormData } = useForm<FormDataAttachSiswa>({
        selected_siswa: [],
    });

    const fetchData = useCallback(
        async (page = 1) => {
            if (!id_kelas) return;

            setLoading(true);
            try {
                const res = await window.axios.get(
                    route("absensi.search.siswa.raw"),
                    {
                        params: { kelas: id_kelas, page },
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

    const handleSelectionChange = useCallback(
        (selectedIds: number[]) => {
            setSelectedSiswaIds(selectedIds);
            setFormData("selected_siswa", selectedIds);
            returnData(selectedIds);
        },
        [returnData, setFormData]
    );

    useEffect(() => {
        if (id_kelas) {
            fetchData();
        }
    }, [id_kelas, fetchData]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Input Siswa ke Kelas dan Mata Pelajaran</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                ) : dataSiswa && dataSiswa.data.length > 0 ? (
                    <SiswaTable
                        dataSiswa={dataSiswa}
                        selectedSiswaIds={selectedSiswaIds}
                        onSelectionChange={handleSelectionChange}
                        onPageChange={fetchData}
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
