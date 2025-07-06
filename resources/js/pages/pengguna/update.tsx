import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router, useForm } from "@inertiajs/react";
import { ArrowLeft, SendHorizonal, Settings } from "lucide-react";
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
import { generateRandomPassword } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select2 } from "@/components/select2";
import ButtonForm from "@/components/button-form";
import { KelasResponseType } from "../kelas";
import { MapelResponseType } from "../mapel";
import { UsersType } from ".";
import { Textarea } from "@/components/ui/textarea";

interface UserUpdateProps extends PageProps {
    mapels: {
        label: string;
        value: string | number;
    }[];
    kelases: {
        label: string;
        value: string | number;
    }[];
    user: UsersType;
}
export default function UserUpdate({
    alert,
    kelases,
    mapels,
    user,
}: UserUpdateProps) {
    useToast(alert);
    const [isGuru, setIsGuru] = useState(false);

    const form = useForm({
        username: "",
        password: "",
        role: "",
        nama_guru: "",
        alamat: "",
        no_telp: "",
        kelas: [] as string[],
        mapels: [] as string[],
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.put(route("user.update", user.id));
    };

    useEffect(() => {
        if (!user) return;
        form.setData("username", user.username);
        form.setData("role", user.role);
        setIsGuru(user.role === "guru" ? true : false);
        if (user.kelas)
            form.setData(
                "kelas",
                user.kelas.map((item) => item.id.toString())
            );
        if (user.mata_pelajarans) {
            form.setData(
                "mapels",
                user.mata_pelajarans.map((item) => item.id.toString())
            );
        }
        if (user.profile_guru) {
            form.setData("nama_guru", user.profile_guru.nama_guru);
            form.setData("alamat", user.profile_guru.alamat);
            form.setData("no_telp", user.profile_guru.no_telp);
        }
    }, [user]);

    return (
        <AuthenticatedLayout title="Update Pengguna">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Update Data Pengguna</h1>
                <Button
                    type="button"
                    variant={"secondary"}
                    onClick={() => router.get(route("user.index"))}
                >
                    <ArrowLeft />
                    Kembali
                </Button>
            </div>
            <div className="mt-4">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardContent className="space-y-4 mt-3">
                            <InputForm
                                label="Username"
                                placeholder="Masukan Username pengguna"
                                value={form.data.username}
                                onChange={(e) =>
                                    form.setData("username", e.target.value)
                                }
                                error={form.errors.username}
                            />
                            <InputForm
                                label="Password"
                                placeholder="Biarkan kosong jika tidak ingin merubah password!"
                                value={form.data.password}
                                onChange={(e) =>
                                    form.setData("password", e.target.value)
                                }
                                rightcontent={
                                    <Button
                                        size="icon"
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            form.setData(
                                                "password",
                                                generateRandomPassword(6)
                                            )
                                        }
                                    >
                                        <Settings />
                                    </Button>
                                }
                            />
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select2
                                    options={[
                                        {
                                            label: "Super Admin",
                                            value: "super-admin",
                                        },
                                        { label: "Guru", value: "guru" },
                                        { label: "BK", value: "bk" },
                                    ]}
                                    value={form.data.role}
                                    onChange={(value) => {
                                        form.setData("role", value);
                                        if (value === "guru") {
                                            setIsGuru(true);
                                        } else {
                                            setIsGuru(false);
                                        }
                                    }}
                                    searchable={false}
                                />
                            </div>
                            <InputForm
                                label="Nama Lengkap"
                                value={form.data.nama_guru}
                                placeholder="Masukan Nama Lengkap"
                                onChange={(e) =>
                                    form.setData("nama_guru", e.target.value)
                                }
                            />
                            <InputForm
                                label="No Handphone"
                                value={form.data.no_telp}
                                type="tel"
                                placeholder="Masukan No Handphone"
                                onChange={(e) =>
                                    form.setData("no_telp", e.target.value)
                                }
                            />
                            <div>
                                <Label className="mb-2">Alamat Lengkap</Label>
                                <Textarea
                                    placeholder="Nama Lengkap"
                                    defaultValue={form.data.alamat}
                                    onChange={(e) =>
                                        form.setData("alamat", e.target.value)
                                    }
                                />
                            </div>
                            {isGuru && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">
                                            Pilih Kelas Yang Akan Di Ampu
                                        </Label>
                                        <Select2
                                            options={kelases ?? []}
                                            value={form.data.kelas}
                                            onChange={(value) => {
                                                form.setData("kelas", value);
                                            }}
                                            multiple={true}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">
                                            Pilih Mata Pelajaran Yang Akan Di
                                            Ampu
                                        </Label>
                                        <Select2
                                            options={mapels ?? []}
                                            value={form.data.mapels}
                                            onChange={(value) => {
                                                form.setData("mapels", value);
                                            }}
                                            multiple={true}
                                        />
                                    </div>
                                </>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <ButtonForm
                                label="Submit"
                                variant="default"
                                loading={form.processing}
                                type="submit"
                                righticon={<SendHorizonal />}
                            />
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
