import ButtonForm from "@/components/button-form";
import { DatePicker } from "@/components/date-picker";
import { Select2 } from "@/components/select2";
import { Label } from "@/components/ui/label";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { BaseResponsePagination, PageProps } from "@/types";
import { BookDown, Loader2, RotateCcw, SquarePen } from "lucide-react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { OptionsSelect2 } from "../absensi/absensiTypes";
import { useForm } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { UsersType } from "../pengguna";
import { KelasResponseType } from "../kelas";
import { MapelResponseType } from "../mapel";
import { SiswaResponseType } from "../siswa";
import { ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/raw-table";
import BadgeStatus from "@/components/BadgeStatus";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AbsensiUpdate from "../absensi/update";
import { cn, STATUSABSENSI } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { exportStyledExcel } from "@/lib/exportToExcelNew";
import { exportAbsensiPDF } from "@/lib/exportToPdf";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import WeeklyDatePicker from "@/components/WeeklyDatePicker";
import { MonthlyDatePicker } from "@/components/MontlyDatePicker";

export type ResultDataType = {
    id: number;
    status: "hadir" | "alpa" | "sakit" | "izin" | "telat";
    user_id: number;
    kelas_id: number;
    mapel_id?: number;
    siswa_id: number;
    jenis_absen?: string;
    guru?: UsersType;
    kelas: KelasResponseType;
    mapel?: MapelResponseType;
    siswa: SiswaResponseType;
    tanggal: Date | string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

interface BulananPageProps extends PageProps {
    kelases: OptionsSelect2[];
}

export default function BulananPage({
    alert,
    kelases,
    auth,
}: BulananPageProps) {
    useToast(alert);
    const { role: RoleUser } = auth.user;

    // State management
    const [resultData, setResultData] =
        useState<BaseResponsePagination<ResultDataType>>();
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [loadingExport, setLoadingExport] = useState({
        excel: false,
        pdf: false,
    });
    const [filterOptions, setFilterOptions] = useState({
        status: "",
        jenis_absen: "",
    });

    const searchForm = useForm({
        tanggal: "",
        kelas: "",
    });

    // Kolom tabel menggunakan useMemo untuk optimasi performa
    const columns = useMemo<ColumnDef<ResultDataType>[]>(
        () => [
            {
                id: "rowNumber",
                header: "No.",
                cell: ({ row }) => {
                    if (!resultData) return "-";
                    const pageIndex = resultData.current_page - 1;
                    const pageSize = resultData.per_page;
                    return pageIndex * pageSize + row.index + 1;
                },
            },
            {
                accessorKey: "siswa.nis",
                header: "No Induk",
                cell: ({ row }) => row.original.siswa?.nis ?? "-",
            },
            {
                accessorKey: "siswa.nama_lengkap",
                header: "Nama Siswa",
                cell: ({ row }) => row.original.siswa?.nama_lengkap ?? "-",
            },
            {
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => <BadgeStatus status={row.original.status} />,
            },
            {
                accessorKey: "jenis_absen",
                header: "Jenis Absen",
                cell: ({ row }) => {
                    const { jenis_absen } = row.original;
                    return jenis_absen
                        ? jenis_absen.replaceAll("_", " ").toUpperCase()
                        : "-";
                },
            },
            {
                accessorKey: "kelas.nama",
                header: "Kelas",
                cell: ({ row }) => row.original.kelas?.nama_kelas ?? "-",
            },
            {
                accessorKey: "tanggal",
                header: "Tanggal",
                cell: ({ row }) =>
                    format(
                        parseISO(String(row.original.tanggal)),
                        "EEEE, dd MMMM yyyy",
                        { locale: id }
                    ),
            },
        ],
        [resultData]
    );

    // Fungsi untuk mengambil data dengan parameter halaman
    const fetchData = useCallback(
        async (page?: number) => {
            if (
                searchForm.data.tanggal === "" &&
                searchForm.data.kelas === ""
            ) {
                toast.error("Tanggal dan Kelas wajib diisi.");
                return;
            }

            setLoadingSearch(true);
            try {
                const params = page
                    ? { ...searchForm.data, page }
                    : searchForm.data;

                const res = await window.axios.get(
                    route("laporan.search.bulanan"),
                    { params }
                );

                if (res.status === 200) {
                    setResultData(res.data.data);
                } else {
                    toast.error("Data tidak ditemukan.");
                    setResultData(undefined);
                }
            } catch (error: any) {
                if (error instanceof AxiosError) {
                    toast.error(
                        error.response?.data.message ?? "Terjadi kesalahan!"
                    );
                }
                setResultData(undefined);
            } finally {
                setLoadingSearch(false);
            }
        },
        [searchForm.data]
    );

    // Handler untuk pencarian dan pagination
    const handleSearch = useCallback(() => fetchData(), [fetchData]);
    const handlePageChange = useCallback(
        (page: number) => fetchData(page),
        [fetchData]
    );

    // Handler untuk refresh data setelah edit
    const refreshData = useCallback(() => fetchData(), [fetchData]);

    // Handler untuk filter data client-side
    const handleChangeFilterResultData = useCallback(
        async (field: "status" | "jenis_absen", value: string) => {
            const updatedFilter = { ...filterOptions, [field]: value };
            setFilterOptions(updatedFilter);

            if (!resultData) {
                toast.error("Data belum dimuat");
                return;
            }

            setLoadingSearch(true);
            try {
                // Filter client-side untuk mengurangi request ke server
                const filtered = resultData.data.filter((item) => {
                    const matchStatus =
                        !updatedFilter.status ||
                        item.status === updatedFilter.status;
                    const matchJenisAbsen =
                        !updatedFilter.jenis_absen ||
                        item.jenis_absen === updatedFilter.jenis_absen;
                    return matchStatus && matchJenisAbsen;
                });

                setResultData({
                    ...resultData,
                    data: filtered,
                });
            } catch (error) {
                toast.error("Gagal memfilter data");
            } finally {
                setLoadingSearch(false);
            }
        },
        [filterOptions, resultData]
    );

    // Handler untuk export data
    const exportData = useCallback(
        async (value: "excel" | "pdf") => {
            if (!resultData) {
                toast.error("Data masih Kosong!");
                return;
            }

            const exportType = value;
            setLoadingExport((prev) => ({ ...prev, [exportType]: true }));

            try {
                const response = await window.axios.get(
                    route("laporan.export.bulanan.all"),
                    { params: searchForm.data }
                );

                if (response.status === 200) {
                    const kelasLabel =
                        kelases.find(
                            (k) => String(k.value) === searchForm.data.kelas
                        )?.label ?? "-";

                    if (exportType === "excel") {
                        exportStyledExcel({
                            data: response.data.data,
                            tanggal: `${format(
                                searchForm.data.tanggal,
                                "MMMM yyyy",
                                { locale: id }
                            )}`,
                            kelas: kelasLabel,
                            type: "bulanan",
                        });
                    } else {
                        exportAbsensiPDF({
                            data: response.data.data,
                            tanggal: ` ${format(
                                searchForm.data.tanggal,
                                "MMMM yyyy",
                                { locale: id }
                            )}`,
                            kelas: kelasLabel,
                            typeLaporan: "Bulanan",
                        });
                    }
                }
            } catch (error) {
                toast.error("Gagal mengekspor data");
                console.error(
                    `Export ${exportType.toUpperCase()} error:`,
                    error
                );
            } finally {
                setLoadingExport((prev) => ({ ...prev, [exportType]: false }));
            }
        },
        [resultData, searchForm.data, kelases]
    );

    useEffect(() => {
        searchForm.setData(
            "tanggal",
            format(new Date(), "yyyy-MM-dd", { locale: id })
        );
    }, []);

    return (
        <AuthenticatedLayout title="Laporan Bulanan">
            {/* Form Pencarian */}
            <Card>
                <CardHeader>
                    <CardTitle>Cari Data Absensi</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <MonthlyDatePicker
                            value={searchForm.data.tanggal}
                            onChange={(date) =>
                                searchForm.setData("tanggal", date)
                            }
                        />
                        <Select2
                            options={[
                                ...kelases,
                                { label: "Semua Kelas", value: "semua_kelas" },
                            ]}
                            value={searchForm.data.kelas}
                            onChange={(value) =>
                                searchForm.setData("kelas", value)
                            }
                            searchable={false}
                            placeholder="Pilih Kelas"
                        />
                        <ButtonForm
                            label="Cari Data Absensi"
                            loading={loadingSearch}
                            onClick={handleSearch}
                            type="button"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Hasil Pencarian */}
            {loadingSearch ? (
                <Skeleton className="h-[300px] w-full rounded-xl mt-4" />
            ) : resultData ? (
                <Card className="mt-4">
                    <CardHeader>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-center mb-2">
                            <CardTitle>Hasil Pencarian Absensi</CardTitle>
                            <div
                                className={cn(
                                    "grid items-center gap-3",
                                    isEditing ? "grid-cols-1" : " grid-cols-2"
                                )}
                            >
                                <Button
                                    onClick={() => {
                                        refreshData();
                                        setIsEditing(!isEditing);
                                    }}
                                    variant={isEditing ? "outline" : "default"}
                                    className={
                                        isEditing
                                            ? "w-fit justify-self-end"
                                            : ""
                                    }
                                >
                                    {isEditing ? (
                                        "Kembali"
                                    ) : (
                                        <>
                                            <SquarePen className="mr-2 h-4 w-4" />
                                            Edit Data Absen
                                        </>
                                    )}
                                </Button>
                                {!isEditing && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline">
                                                <BookDown className="mr-2 h-4 w-4" />
                                                Export Data
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>
                                                Export Sebagai
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    exportData("pdf")
                                                }
                                            >
                                                {loadingExport.pdf ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    "PDF"
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    exportData("excel")
                                                }
                                            >
                                                {loadingExport.excel ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Loading...
                                                    </>
                                                ) : (
                                                    "EXCEL"
                                                )}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                        <Separator />

                        {/* Filter Hasil */}
                        <h1 className="mt-4">Filter Hasil Pencarian</h1>
                        <div className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-2">
                            <Select2
                                options={[
                                    {
                                        label: "Absen Siang",
                                        value: "absen_siang",
                                    },
                                    {
                                        label: "Absen Pagi",
                                        value: "absen_pagi",
                                    },
                                ]}
                                value={filterOptions.jenis_absen}
                                onChange={(value) =>
                                    handleChangeFilterResultData(
                                        "jenis_absen",
                                        value
                                    )
                                }
                                placeholder="Jenis Absen"
                                searchable={false}
                            />

                            <Select2
                                options={STATUSABSENSI}
                                value={filterOptions.status}
                                onChange={(value) =>
                                    handleChangeFilterResultData(
                                        "status",
                                        value
                                    )
                                }
                                placeholder="Status Absensi"
                                searchable={false}
                            />
                            <Button
                                onClick={() => {
                                    setFilterOptions({
                                        jenis_absen: "",
                                        status: "",
                                    });
                                    handleSearch();
                                }}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Reset Filter
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {isEditing ? (
                            <AbsensiUpdate
                                dataSiswa={resultData}
                                role={RoleUser}
                            />
                        ) : resultData === undefined ? (
                            "Data Kosong!"
                        ) : (
                            <DataTable
                                columns={columns}
                                data={resultData.data}
                                links={resultData.links}
                                path="laporan.search.harian"
                                current_page={resultData.current_page}
                                per_page={resultData.per_page}
                                last_page={resultData.last_page}
                                total={resultData.total}
                                isJson={true}
                                handlePageChange={handlePageChange}
                            />
                        )}
                    </CardContent>
                </Card>
            ) : null}
        </AuthenticatedLayout>
    );
}
