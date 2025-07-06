import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { ResultDataType } from "../laporan/semester";
import { BaseResponsePagination } from "@/types";
import ButtonForm from "@/components/button-form";
import { Select2 } from "@/components/select2";
import { OptionsSelect2 } from "./absensiTypes";

interface AbsensiUpdateProps {
    dataSiswa: BaseResponsePagination<ResultDataType>;
    role: "super-admin" | "guru" | "bk";
}

export default function AbsensiUpdate({ dataSiswa, role }: AbsensiUpdateProps) {
    const form = useForm<{
        selected_siswa: {
            id_siswa: string;
            status_absen: string;
            id_absensi: string;
        }[];
    }>({
        selected_siswa: [],
    });

    const handleStatusChange = (
        id_siswa: string,
        status_absen: string,
        id_absensi: string
    ) => {
        const updated = form.data.selected_siswa.filter(
            (s) => s.id_siswa !== id_siswa
        );
        updated.push({ id_siswa, status_absen, id_absensi });
        form.setData("selected_siswa", updated);
    };

    const handleSubmit = () => {
        form.put(route("absensi.update"));
    };

    const statusAbsensi: OptionsSelect2[] = [
        {
            label: "Hadir",
            value: "hadir",
        },
        {
            label: "Alpa",
            value: "alpa",
        },
        {
            label: "Izin",
            value: "izin",
        },
        {
            label: "Sakit",
            value: "sakit",
        },
    ];

    // ⛏️ Auto-fill data saat komponen dimount
    useEffect(() => {
        const initialSelected = dataSiswa.data.map((s) => ({
            id_siswa: String(s.siswa_id),
            status_absen: String(s.status),
            id_absensi: String(s.id),
        }));
        form.setData("selected_siswa", initialSelected);
    }, [dataSiswa]);

    return (
        <Card className="mt-4">
            <CardContent className="mt-3">
                {dataSiswa?.data?.length > 0 ? (
                    <div className="relative max-h-[300px] overflow-auto rounded border">
                        <Table>
                            <TableHeader>
                                <TableRow className="sticky top-0 z-50 bg-background shadow border">
                                    <TableHead className="w-[5%]">
                                        Urut
                                    </TableHead>
                                    <TableHead className="w-[100px]">
                                        No Induk
                                    </TableHead>
                                    <TableHead className="text-center">
                                        Nama
                                    </TableHead>
                                    <TableHead className="w-[10%]">
                                        L/P
                                    </TableHead>
                                    <TableHead>Jurusan</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {dataSiswa.data.map((siswa, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{siswa.siswa.nis}</TableCell>
                                        <TableCell>
                                            {siswa.siswa.nama_lengkap}
                                        </TableCell>
                                        <TableCell>
                                            {siswa.siswa.jenis_kelamin === null
                                                ? "-"
                                                : siswa.siswa.jenis_kelamin}
                                        </TableCell>
                                        <TableCell>
                                            {siswa.siswa.jurusan}
                                        </TableCell>
                                        <TableCell>
                                            <Select2
                                                options={
                                                    role === "super-admin"
                                                        ? [
                                                              ...statusAbsensi,
                                                              {
                                                                  label: "Telat",
                                                                  value: "telat",
                                                              },
                                                          ]
                                                        : statusAbsensi
                                                }
                                                onChange={(value) =>
                                                    handleStatusChange(
                                                        siswa.siswa.id.toString(),
                                                        value,
                                                        String(siswa.id)
                                                    )
                                                }
                                                value={
                                                    form.data.selected_siswa.find(
                                                        (s: {
                                                            id_siswa: string;
                                                        }) =>
                                                            s.id_siswa ===
                                                            String(
                                                                siswa.siswa.id
                                                            )
                                                    )?.status_absen || ""
                                                }
                                                searchable={false}
                                                placeholder="Pilih Status Kehadiran Siswa"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Tidak ada data siswa tersedia.
                    </p>
                )}
            </CardContent>
            <CardFooter>
                <ButtonForm
                    label="Update Data Absensi"
                    loading={form.processing}
                    onClick={handleSubmit}
                />
            </CardFooter>
        </Card>
    );
}
