import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { PageProps } from "@/types";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircularProgress } from "./AdminPage";
import { router } from "@inertiajs/react";
import { Schedule } from "@/types/schedule";
import ButtonForm from "@/components/button-form";
import { CalendarIcon } from "lucide-react";
interface GuruPageProps extends PageProps {
    statistikPerKelas?: {
        nama_kelas: string;
        siswa: number;
        presentStudent: number;
        remaining_percentage: number;
    }[];
    jadwal_hari_ini?: Schedule[];
}

export default function GuruPage({
    alert,
    auth,
    statistikPerKelas,
    jadwal_hari_ini,
}: GuruPageProps) {
    useToast(alert);
    const { user } = auth;
    const hasJadwal = jadwal_hari_ini && jadwal_hari_ini.length > 0;
    const hasStatistik = statistikPerKelas && statistikPerKelas.length > 0;
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(user.api_token);
    }
    return (
        <AuthenticatedLayout title="Beranda Guru">
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Selamat mengajar, Bpk/Ibu{" "}
                    {user.profile_guru
                        ? user.profile_guru.nama_guru
                        : user.username}
                </h2>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Kelas Hari Ini</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {!hasJadwal ? (
                                <JadwalKosongFallback />
                            ) : (
                                jadwal_hari_ini.map((cls) => (
                                    <div
                                        key={cls.id}
                                        className="flex justify-between items-center border-b pb-3"
                                    >
                                        <div>
                                            <h4 className="font-medium">
                                                {cls.mata_pelajarans.nama_mapel}{" "}
                                                - {cls.kelas.nama_kelas}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {cls.jam_mulai} -{" "}
                                                {cls.jam_selesai}
                                            </p>
                                        </div>
                                        <ButtonForm
                                            size={"sm"}
                                            label="Ambil Absensi"
                                            onClick={() =>
                                                router.get(
                                                    route("absensi.index", {
                                                        kelas_id: cls.kelas.id,
                                                        mapel_id:
                                                            cls.mata_pelajarans
                                                                .id,
                                                    })
                                                )
                                            }
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {!hasStatistik ? (
                    <StatKosongFallback />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistik Kelas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs
                                    defaultValue={
                                        statistikPerKelas[0].nama_kelas
                                    }
                                    className="w-full"
                                >
                                    <TabsList className="w-full overflow-auto">
                                        {statistikPerKelas.map(
                                            (stat, index) => (
                                                <TabsTrigger
                                                    value={stat.nama_kelas}
                                                    key={index}
                                                >
                                                    {stat.nama_kelas}
                                                </TabsTrigger>
                                            )
                                        )}
                                    </TabsList>
                                    {statistikPerKelas.map((stat, index) => (
                                        <TabsContent
                                            value={stat.nama_kelas}
                                            key={index}
                                        >
                                            <h1>Kehadiran Hari Ini</h1>
                                            <div className="flex justify-center items-center">
                                                <CircularProgress
                                                    value={
                                                        stat.remaining_percentage
                                                    }
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-2xl font-bold">
                                                    {stat.remaining_percentage}%
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {stat.siswa -
                                                        stat.presentStudent}{" "}
                                                    dari {stat.siswa} siswa
                                                    belum absen
                                                </p>
                                            </div>
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Aksi</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col space-y-3">
                                    <Button
                                        variant="secondary"
                                        onClick={() =>
                                            router.get(
                                                route("laporan.semester")
                                            )
                                        }
                                    >
                                        Rekap Semester
                                    </Button>
                                    {/* <Button variant="outline">Input Nilai</Button> */}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

const StatKosongFallback = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
        <CalendarIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
            Tidak Ada Data
        </h3>
    </div>
);
const JadwalKosongFallback = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
        <CalendarIcon className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
            Tidak Ada Jadwal Hari Ini
        </h3>
        <p className="text-gray-500 mb-4">
            Anda tidak memiliki jadwal mengajar untuk hari ini.
        </p>
        <Button
            variant="outline"
            onClick={() => router.get(route("jadwal.index"))}
        >
            Lihat Jadwal Lengkap
        </Button>
    </div>
);
