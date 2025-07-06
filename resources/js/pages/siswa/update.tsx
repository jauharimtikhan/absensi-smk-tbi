import { Button } from "@/components/ui/button";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { Link, router, useForm } from "@inertiajs/react";
import { ArrowLeft, Loader2, SendHorizonal, Settings } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import InputForm from "@/components/InputForm";
import ButtonForm from "@/components/button-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select2 } from "@/components/select2";
import { PageProps } from "@/types";
import useToast from "@/hooks/useToast";
import { SiswaResponseType } from ".";
import toast from "react-hot-toast";

interface SiswaCreateProps extends PageProps {
    kelases: {
        label: string;
        value: string;
    }[];
    jurusans: {
        label: string;
        value: string;
    }[];
    siswa: SiswaResponseType | null;
}

export const statusOptions = [
    {
        label: "Aktif",
        value: "aktif",
    },
    {
        label: "DO",
        value: "do",
    },
    {
        label: "Tanpa Keterangan",
        value: "tanpa_keterangan",
    },
];

export default function SiswaUpdate({
    alert,
    kelases,
    siswa,
    jurusans,
}: SiswaCreateProps) {
    useToast(alert);
    const [loadingGenerateNis, setLoadingGenerateNis] = useState(false);

    const form = useForm({
        nama_lengkap: "",
        nis: "",
        kelas: "",
        status: "",
        jurusan: "",
        jenis_kelamin: "",
    });

    const handleGenerateNis = async () => {
        setLoadingGenerateNis(true);
        const res = await window.axios.get(route("siswa.generate.nis"));
        if (res.status === 201 && res.data.success) {
            form.setData("nis", res.data.nis);
        } else {
            form.setData("nis", "");
        }
        setLoadingGenerateNis(false);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!siswa) {
            toast.error("Data siswa tidak ditemukan!");
            return;
        }
        form.put(route("siswa.update", siswa.id));
    };

    useEffect(() => {
        if (siswa) {
            form.setData("jenis_kelamin", siswa.jenis_kelamin ?? "");
            form.setData("nama_lengkap", siswa.nama_lengkap ?? "");
            form.setData("nis", siswa.nis ?? "");
            form.setData("jurusan", siswa.jurusan ?? "");
            form.setData("status", siswa.status ?? "");
            form.setData("kelas", siswa.kelas ?? "");
        }
    }, [siswa]);
    return (
        <AuthenticatedLayout title="Update Siswa">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Update Data Siswa</h1>
                <Button
                    type="button"
                    variant={"secondary"}
                    onClick={() => router.get(route("siswa.index"))}
                >
                    <ArrowLeft />
                    Kembali
                </Button>
            </div>
            <div className="mt-6">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardContent className="mt-3 space-y-4">
                            <InputForm
                                label="Nama Lengkap"
                                placeholder="Masukan Nama Lengkap Siswa"
                                error={form.errors.nama_lengkap}
                                value={form.data.nama_lengkap}
                                onChange={(e) =>
                                    form.setData("nama_lengkap", e.target.value)
                                }
                            />
                            <InputForm
                                label="NIS"
                                placeholder="Buat Manual / Generate otomatis NIS"
                                error={form.errors.nis}
                                value={form.data.nis}
                                onChange={(e) =>
                                    form.setData("nis", e.target.value)
                                }
                                rightcontent={
                                    <Button
                                        type="button"
                                        size={"icon"}
                                        variant={"outline"}
                                        onClick={handleGenerateNis}
                                    >
                                        {loadingGenerateNis ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <Settings />
                                        )}
                                    </Button>
                                }
                            />
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="kelas">Kelas</Label>
                                <div className="flex flex-col">
                                    <Select2
                                        options={kelases}
                                        value={form.data.kelas}
                                        onChange={(value) =>
                                            form.setData("kelas", String(value))
                                        }
                                    />
                                    {form.errors.kelas && (
                                        <span className="text-red-500">
                                            {form.errors.kelas}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="jurusan">Jurusan</Label>
                                <div className="flex flex-col">
                                    <Select2
                                        searchable={false}
                                        options={jurusans}
                                        value={form.data.jurusan}
                                        onChange={(value) =>
                                            form.setData(
                                                "jurusan",
                                                String(value)
                                            )
                                        }
                                    />
                                    {form.errors.jurusan && (
                                        <span className="text-red-500">
                                            {form.errors.jurusan}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="kelas">Jenis Kelamin</Label>
                                <div className="flex flex-col">
                                    <Select2
                                        searchable={false}
                                        options={[
                                            {
                                                label: "Laki-Laki",
                                                value: "L",
                                            },
                                            {
                                                label: "Perempuan",
                                                value: "P",
                                            },
                                        ]}
                                        value={form.data.jenis_kelamin}
                                        onChange={(value) =>
                                            form.setData(
                                                "jenis_kelamin",
                                                String(value)
                                            )
                                        }
                                    />
                                    {form.errors.jenis_kelamin && (
                                        <span className="text-red-500">
                                            {form.errors.jenis_kelamin}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="kelas">Status</Label>
                                <div className="flex flex-col">
                                    <Select2
                                        options={statusOptions}
                                        value={form.data.status}
                                        onChange={(value) =>
                                            form.setData(
                                                "status",
                                                String(value)
                                            )
                                        }
                                    />
                                    {form.errors.status && (
                                        <span className="text-red-500">
                                            {form.errors.status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <ButtonForm
                                label="Submit"
                                loading={form.processing}
                                righticon={<SendHorizonal />}
                            />
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
