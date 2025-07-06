import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { PageProps, User } from "@/types";
import { router } from "@inertiajs/react";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminPageProps extends PageProps {
    total_siswa: number;
    presentase: number;
    remaining_percentage: number;
    guru_aktif: number;
}

export default function AdminPage({ ...props }: AdminPageProps) {
    useToast(props.alert);
    const role = props.auth.user.role;

    const getTitle = () => {
        if (role === "super-admin") {
            return "Beranda Super Admin";
        } else if (role === "bk") {
            return `Beranda Guru BK`;
        }
    };
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(props.auth.user.api_token);
    }

    return (
        <AuthenticatedLayout title={getTitle()}>
            <div>
                <h2 className="text-xl font-semibold mb-4">
                    Selamat datang,{" "}
                    {role === "super-admin" ? "" : role === "bk" ? "guru" : ""}{" "}
                    {props.auth.user.profile_guru?.nama_guru ??
                        props.auth.user.username.replaceAll("_", " ")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Total Siswa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {props.total_siswa}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Kehadiran Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CircularProgress value={props.presentase} />
                            <div className="ml-4">
                                <p className="text-2xl font-bold">
                                    {props.presentase}%
                                </p>
                                <p className="text-sm text-gray-500">
                                    {props.total_siswa - props.presentase} dari{" "}
                                    {props.total_siswa} siswa belum absen
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Guru Aktif</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">
                                {props.guru_aktif}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Aksi Cepat</h3>
                    <div className="flex space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button>Rekab Absensi</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Mingguan</DropdownMenuItem>
                                <DropdownMenuItem>Bulanan</DropdownMenuItem>
                                <DropdownMenuItem>Semester</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {role === "super-admin" && (
                            <Button
                                onClick={() => router.get(route("user.index"))}
                                variant="secondary"
                            >
                                Kelola Pengguna
                            </Button>
                        )}
                        <Button
                            onClick={() => router.get(route("jadwalkbm.index"))}
                            variant="outline"
                        >
                            Atur Jadwal
                        </Button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export function CircularProgress({ value }: { value: number }) {
    return (
        <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#eee"
                    strokeWidth="3"
                />
                <path
                    d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray={`${value}, 100`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {Math.round(value)}%
            </div>
        </div>
    );
}
