import React, { FormEvent, useState, useEffect, useCallback } from "react";
import { InertiaFormProps, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Components
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { Select2 } from "@/components/select2";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Hand, SendHorizonal } from "lucide-react";
import ButtonForm from "@/components/button-form";
import { Skeleton } from "@/components/ui/skeleton";
import AttachMapelToSiswa from "./AttachMapelToSiswa";
import useToast from "@/hooks/useToast";

// Types
import {
    SiswaResponseType,
    KelasResponseType,
    MapelResponseType,
    GuruData,
    OptionsSelect2,
    FormAbsensiType,
    AbsensiIndexProps,
} from "./absensiTypes";

// Constants
const statusAbsensi: OptionsSelect2[] = [
    { label: "Hadir", value: "hadir" },
    { label: "Alpa", value: "alpa" },
    { label: "Izin", value: "izin" },
    { label: "Sakit", value: "sakit" },
];

// Custom hook untuk logika absensi
const useAbsensiLogic = (
    initialFormData: FormAbsensiType,
    role: "super-admin" | "guru" | "bk"
) => {
    const form = useForm<FormAbsensiType>(initialFormData);
    const [dataSiswa, setDataSiswa] = useState<SiswaResponseType[]>();
    const [loadingSearchSiswa, setLoadingSearchSiswa] = useState(false);
    const [attachMapelToSiswaScreen, setAttachMapelToSiswaScreen] =
        useState(false);
    const urlParams = new URLSearchParams(window.location.search);
    // Set tanggal default saat pertama kali render
    useEffect(() => {
        if (!form.data.tanggal && urlParams.get("tanggal")) {
            form.setData(
                "tanggal",
                decodeURIComponent(urlParams.get("tanggal") ?? "")
            );
        } else {
            form.setData("tanggal", new Date().toISOString().split("T")[0]);
        }
        if (!form.data.kelas && urlParams.get("kelas_id")) {
            form.setData(
                "kelas",
                decodeURIComponent(urlParams.get("kelas_id") ?? "")
            );
        }

        if (!form.data.mapel && urlParams.get("mapel_id")) {
            form.setData(
                "mapel",
                decodeURIComponent(urlParams.get("mapel_id") ?? "")
            );
        }
        if (urlParams.has("mapel_id") && urlParams.has("kelas_id")) {
            handleGetDataSiswa(
                decodeURIComponent(urlParams.get("kelas_id") ?? ""),
                decodeURIComponent(urlParams.get("mapel_id") ?? "")
            );
        }
    }, []);

    // Handler untuk mengambil data siswa
    const handleGetDataSiswa = useCallback(
        async (kode_kelas: string, mapel?: string) => {
            setLoadingSearchSiswa(true);
            try {
                const res = await window.axios.get(
                    route("absensi.search.siswa", { kelas: kode_kelas, mapel })
                );
                if (res.status === 200) {
                    setDataSiswa(res.data.data);
                }
            } catch (error: any) {
                if (
                    error instanceof AxiosError &&
                    error.response?.status === 422
                ) {
                    toast.error(
                        error.response.data?.message ?? "Kode Kelas Tidak Sah"
                    );
                } else {
                    toast.error("Terjadi kesalahan saat mengambil data siswa");
                }
            } finally {
                setLoadingSearchSiswa(false);
            }
        },
        []
    );

    // Handler untuk perubahan status absensi
    const handleStatusChange = useCallback(
        (id_siswa: string, status_absen: string) => {
            const updated = form.data.selected_siswa.filter(
                (s) => s.id_siswa !== id_siswa
            );
            updated.push({ id_siswa, status_absen });
            form.setData("selected_siswa", updated);
        },
        [form]
    );

    // Handler untuk perubahan kelas
    const handleKelasChange = useCallback(
        (value: string) => {
            form.setData("kelas", value);
            if (role === "super-admin") {
                handleGetDataSiswa(value, form.data.mapel);
            } else if (form.data.mapel) {
                handleGetDataSiswa(value, form.data.mapel);
            }
        },
        [form, handleGetDataSiswa, role]
    );

    // Handler untuk perubahan mapel
    const handleMapelChange = useCallback(
        (value: string) => {
            form.setData("mapel", value);
            if (role === "super-admin") {
                handleGetDataSiswa(form.data.kelas, value);
            } else if (form.data.kelas) {
                handleGetDataSiswa(form.data.kelas, value);
            }
        },
        [form, handleGetDataSiswa, role]
    );

    return {
        form,
        dataSiswa,
        loadingSearchSiswa,
        attachMapelToSiswaScreen,
        setAttachMapelToSiswaScreen,
        handleGetDataSiswa,
        handleStatusChange,
        handleKelasChange,
        handleMapelChange,
    };
};

// Komponen untuk tabel siswa
const SiswaTable = ({
    dataSiswa,
    form,
    handleStatusChange,
    selectedKelas,
    role,
}: {
    dataSiswa: SiswaResponseType[];
    form: any;
    handleStatusChange: (id_siswa: string, status_absen: string) => void;
    selectedKelas?: OptionsSelect2;
    role: "super-admin" | "guru" | "bk";
}) => {
    return (
        <Card className="mt-4">
            <CardContent className="mt-3">
                <div className="relative max-h-[300px] overflow-auto rounded border">
                    <Table>
                        <TableCaption>
                            Total Siswa Kelas {selectedKelas?.label ?? "-"} -{" "}
                            {dataSiswa.length} Siswa
                        </TableCaption>
                        <TableHeader>
                            <TableRow className="sticky top-0 z-50 bg-background shadow border">
                                <TableHead className="w-[5%]">Urut</TableHead>
                                <TableHead className="w-[100px]">
                                    No Induk
                                </TableHead>
                                <TableHead className="text-center">
                                    Nama
                                </TableHead>
                                <TableHead className="w-[10%]">L/P</TableHead>
                                <TableHead>Jurusan</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {dataSiswa.map((siswa, index) => (
                                <SiswaTableRow
                                    key={siswa.id}
                                    index={index}
                                    siswa={siswa}
                                    handleStatusChange={handleStatusChange}
                                    form={form}
                                    role={role}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

// Komponen untuk baris tabel siswa
const SiswaTableRow = ({
    role,
    handleStatusChange,
    siswa,
    form,
    index,
}: {
    role: string;
    handleStatusChange: (id_siswa: string, status_absen: string) => void;
    siswa: SiswaResponseType;
    form: any;
    index: number;
}) => {
    return (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{siswa.nis}</TableCell>
            <TableCell>{siswa.nama_lengkap}</TableCell>
            <TableCell>{siswa.jenis_kelamin || "-"}</TableCell>
            <TableCell>{siswa.jurusan}</TableCell>
            <TableCell>
                <Select2
                    options={
                        role === "super-admin"
                            ? [
                                  ...statusAbsensi,
                                  { label: "Telat", value: "telat" },
                              ]
                            : statusAbsensi
                    }
                    onChange={(value) =>
                        handleStatusChange(siswa.id.toString(), value)
                    }
                    value={
                        form.data.selected_siswa.find(
                            (s: { id_siswa: string }) =>
                                s.id_siswa === String(siswa.id)
                        )?.status_absen || ""
                    }
                    searchable={false}
                    placeholder="Pilih Status Kehadiran Siswa"
                />
            </TableCell>
        </TableRow>
    );
};

// Komponen untuk form input
const FormInputs = ({
    role,
    kelases,
    mapels,
    users,
    guruData,
    form,
    handleKelasChange,
    handleMapelChange,
}: {
    role: "super-admin" | "guru" | "bk";
    kelases: OptionsSelect2[];
    mapels: OptionsSelect2[];
    users: OptionsSelect2[];
    guruData: GuruData;
    form: InertiaFormProps<FormAbsensiType>;
    handleKelasChange: (value: string) => void;
    handleMapelChange: (value: string) => void;
}) => {
    return (
        <Card>
            <CardContent className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                    <Label>Pilih Tanggal Absensi</Label>
                    <DatePicker
                        date={form.data.tanggal}
                        mode="single"
                        selected={new Date(form.data.tanggal)}
                        onSelected={(value) => form.setData("tanggal", value)}
                        placeholder="Masukan Tanggal Absensi"
                        todayAction={() =>
                            form.setData("tanggal", new Date().toString())
                        }
                        captionLayout="dropdown"
                    />
                </div>

                {role === "super-admin" || role === "bk" ? (
                    <>
                        <div>
                            <Label>Pilih Kelas</Label>
                            <Select2
                                options={kelases}
                                value={form.data.kelas}
                                onChange={handleKelasChange}
                                placeholder="Pilih Kelas"
                            />
                            {form.errors.kelas && (
                                <span className="text-red-500">
                                    {form.errors.kelas}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Pilih Mata pelajaran</Label>
                            <Select2
                                options={[
                                    {
                                        label: "Keseluruhan",
                                        value: "keseluruhan",
                                    },
                                    ...mapels,
                                ]}
                                value={form.data.mapel}
                                onChange={handleMapelChange}
                                placeholder="Pilih Mata Pelajaran"
                            />
                        </div>
                        {!["bk", "guru"].includes(role) && (
                            <div>
                                <Label>Pilih Guru Pengajar</Label>
                                <Select2
                                    options={users}
                                    value={form.data.user_id}
                                    onChange={(value) =>
                                        form.setData("user_id", value)
                                    }
                                    placeholder="Pilih Guru Pengajar"
                                />
                            </div>
                        )}
                        <div className="col-span-full">
                            <Label>Pilih Jenis Absensi</Label>
                            <Select2
                                options={[
                                    {
                                        label: "Keseluruhan",
                                        value: "keseluruhan",
                                    },
                                    {
                                        label: "Absen Pagi",
                                        value: "absen_pagi",
                                    },
                                    {
                                        label: "Absen Siang",
                                        value: "absen_siang",
                                    },
                                ]}
                                value={form.data.jenis_absen}
                                onChange={(value) =>
                                    form.setData("jenis_absen", value)
                                }
                                placeholder="Pilih Jenis Absensi"
                                searchable={false}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {guruData.kelas && guruData.kelas.length === 0 ? (
                            <div className="text-red-500">
                                Anda Belum Memiliki Kelas Yang Di Ampu!
                            </div>
                        ) : (
                            <div>
                                <Label>Pilih Kelas</Label>
                                <Select2
                                    options={
                                        guruData.kelas &&
                                        guruData.kelas.map((item) => ({
                                            label: item.nama_kelas,
                                            value: item.id,
                                        }))
                                    }
                                    value={form.data.kelas}
                                    onChange={handleKelasChange}
                                    placeholder="Pilih Kelas"
                                />
                                {form.errors.kelas && (
                                    <span className="text-red-500">
                                        {form.errors.kelas}
                                    </span>
                                )}
                            </div>
                        )}
                        {guruData.kelas.length === 0 ? (
                            <div className="text-red-500">
                                Anda Belum Memiliki Mata Pelajaran Yang Di Ampu!
                            </div>
                        ) : (
                            <div>
                                <Label>Pilih Mata Pelajaran</Label>
                                <Select2
                                    options={guruData.mata_pelajarans.map(
                                        (item) => ({
                                            label: item.nama_mapel,
                                            value: item.id,
                                        })
                                    )}
                                    value={form.data.mapel}
                                    onChange={handleMapelChange}
                                    placeholder="Pilih Mata Pelajaran"
                                />
                                {form.errors.mapel && (
                                    <span className="text-red-500">
                                        {form.errors.mapel}
                                    </span>
                                )}
                            </div>
                        )}
                        <div>
                            <Label>Pilih Jenis Absensi</Label>
                            <Select2
                                options={[
                                    {
                                        label: "Keseluruhan",
                                        value: "keseluruhan",
                                    },
                                    {
                                        label: "Absen Pagi",
                                        value: "absen_pagi",
                                    },
                                    {
                                        label: "Absen Siang",
                                        value: "absen_siang",
                                    },
                                ]}
                                value={form.data.jenis_absen}
                                onChange={(value) =>
                                    form.setData("jenis_absen", value)
                                }
                                placeholder="Pilih Jenis Absensi"
                                searchable={false}
                            />
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

// Komponen utama
export default function AbsensiIndex({
    alert,
    kelases,
    mapels,
    auth,
    users,
    guruData,
}: AbsensiIndexProps) {
    useToast(alert);
    const { role: RoleUser } = auth.user;
    const [attachSiswaToMapelIds, setAttachSiswaToMapelIds] = useState<
        number[]
    >([]);
    const [loadingAttach, setLoadingAttach] = useState(false);

    // Inisialisasi form
    const initialFormData: FormAbsensiType = {
        tanggal: "",
        kelas: "",
        mapel: "",
        jenis_absen: "",
        selected_siswa: [],
        user_id: "",
    };

    // Menggunakan custom hook untuk logika absensi
    const {
        form,
        dataSiswa,
        loadingSearchSiswa,
        attachMapelToSiswaScreen,
        setAttachMapelToSiswaScreen,
        handleStatusChange,
        handleKelasChange,
        handleMapelChange,
        handleGetDataSiswa,
    } = useAbsensiLogic(initialFormData, RoleUser);

    // Handler untuk submit form
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route("absensi.store"));
    };

    const handleAttachSiswaToMapel = async () => {
        const kelasFilled = form.data.kelas !== "";
        const mapelFilled = form.data.mapel !== "";
        if (!kelasFilled || (!mapelFilled && !attachSiswaToMapelIds)) {
            toast.error("Kode Kelas Atau Kode Mapel Tidak Sah! ");
            return;
        }
        setLoadingAttach(true);
        try {
            const res = await window.axios.post(route("absensi.attachSiswa"), {
                mapel_id: form.data.mapel,
                siswa_ids: attachSiswaToMapelIds,
                kelas_id: form.data.kelas,
            });
            if (res.status === 200) {
                toast.success(res.data.message);
                await handleGetDataSiswa(form.data.kelas, form.data.mapel);
            }
        } catch (error: any) {
            if (error instanceof AxiosError) {
                toast.error(
                    error.response?.data.message ?? "Terjadi Kesalahan!"
                );
                return;
            }
        } finally {
            setLoadingAttach(false);
        }
    };

    // Render tombol submit berdasarkan kondisi
    const renderButtonSubmit = () => {
        const kelasFilled = form.data.kelas !== "";
        const mapelFilled = form.data.mapel !== "";

        if (!kelasFilled && !mapelFilled && !dataSiswa) return null;

        if (kelasFilled && mapelFilled && dataSiswa && dataSiswa.length === 0) {
            return attachMapelToSiswaScreen ? (
                <div className="flex justify-end space-x-4">
                    <ButtonForm
                        label="Kembali"
                        lefticon={<ArrowLeft />}
                        type="button"
                        onClick={() => setAttachMapelToSiswaScreen(false)}
                        variant="outline"
                    />

                    <ButtonForm
                        label="Tambah Siswa Ke Mapel"
                        righticon={<SendHorizonal />}
                        type="button"
                        onClick={handleAttachSiswaToMapel}
                        loading={loadingAttach}
                    />
                </div>
            ) : (
                <div className="flex justify-end">
                    <ButtonForm
                        label="Input Data Siswa"
                        righticon={<SendHorizonal />}
                        type="button"
                        onClick={() => setAttachMapelToSiswaScreen(true)}
                    />
                </div>
            );
        }

        if (kelasFilled && mapelFilled && dataSiswa && dataSiswa.length > 0) {
            return (
                <div className="flex justify-end">
                    <ButtonForm
                        label="Simpan Data Absensi"
                        righticon={<SendHorizonal />}
                        type="submit"
                        loading={form.processing}
                    />
                </div>
            );
        }

        return null;
    };

    // Mendapatkan label mapel yang dipilih
    const selectedMapelLabel = mapels.find(
        (m) => String(m.value) === form.data.mapel
    )?.label;
    if (
        guruData.kelas &&
        guruData.kelas.length === 0 &&
        guruData.mata_pelajarans &&
        guruData.mata_pelajarans.length === 0 &&
        !["super-admin", "bk"].includes(guruData.role)
    ) {
        return (
            <AuthenticatedLayout title="Absensi">
                <div className="flex flex-col justify-center items-center space-y-3">
                    <div className="p-4 border-red-600 rounded-full border-2 justify-center items-center flex">
                        <Hand className="text-red-500" size={42} />
                    </div>
                    <p className="text-red-500">
                        *Silahkan hubungi staff TU atau Admin, Untuk aktivasi
                        kelas dan mata pelajaran!
                    </p>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout title="Absensi">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
                <FormInputs
                    role={RoleUser}
                    kelases={kelases}
                    mapels={mapels}
                    users={users}
                    guruData={guruData}
                    form={form}
                    handleKelasChange={handleKelasChange}
                    handleMapelChange={handleMapelChange}
                />

                {loadingSearchSiswa ? (
                    <div className="flex items-center justify-center">
                        <Skeleton className="h-[300px] w-full rounded-xl" />
                    </div>
                ) : dataSiswa && dataSiswa.length > 0 ? (
                    <SiswaTable
                        dataSiswa={dataSiswa}
                        form={form}
                        handleStatusChange={handleStatusChange}
                        selectedKelas={kelases.find(
                            (k) => String(k.value) === form.data.kelas
                        )}
                        role={RoleUser}
                    />
                ) : attachMapelToSiswaScreen ? (
                    <AttachMapelToSiswa
                        id_kelas={Number(form.data.kelas)}
                        id_mapel={Number(form.data.mapel)}
                        returnData={(ids) => setAttachSiswaToMapelIds(ids)}
                    />
                ) : guruData.kelas &&
                  guruData.kelas.length === 0 &&
                  guruData.mata_pelajarans &&
                  guruData.mata_pelajarans.length === 0 ? null : (
                    <Card>
                        <CardHeader className="my-2">
                            <CardTitle className="text-center text-red-500">
                                {guruData && selectedMapelLabel
                                    ? `Belum Ada Siswa Di Mata Pelajaran ${selectedMapelLabel} Ini`
                                    : "Silakan pilih kelas dan mata pelajaran terlebih dahulu"}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                )}

                {renderButtonSubmit()}
            </form>
        </AuthenticatedLayout>
    );
}
