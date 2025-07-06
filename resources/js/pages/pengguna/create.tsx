import { Button } from "@/components/ui/button";
import useToast from "@/hooks/useToast";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { PageProps } from "@/types";
import { router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Clipboard,
    ClipboardCheck,
    Copy,
    SendHorizonal,
    Settings,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import InputForm from "@/components/InputForm";
import {
    formatIndonesianPhoneNumber,
    generateRandomPassword,
} from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select2 } from "@/components/select2";
import ButtonForm from "@/components/button-form";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCopy } from "@/hooks/useCopy";
import toast from "react-hot-toast";

interface UserCreateProps extends PageProps {
    mapels: {
        label: string;
        value: string | number;
    }[];
    kelases: {
        label: string;
        value: string | number;
    }[];
}
export default function UserCreate({
    alert,
    kelases,
    mapels,
}: UserCreateProps) {
    useToast(alert);
    const [isGuru, setIsGuru] = useState(false);
    const { copy, isCopied, error: errorCopy } = useCopy();
    const form = useForm({
        username: "",
        password: "",
        role: "",
        kelas: [],
        mapels: [],
        nama_lengkap: "",
        no_telp: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        form.post(route("user.store"));
    };
    useEffect(() => {
        if (errorCopy) {
            toast.error(errorCopy);
        }
    }, [errorCopy]);
    return (
        <AuthenticatedLayout title="Tambah Pengguna">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <h1 className="text-2xl font-semibold">Tambah Data Pengguna</h1>
                <div className="flex items-center gap-2">
                    <Button
                        className="flex flex-1"
                        type="button"
                        variant={"secondary"}
                        onClick={() => router.get(route("user.index"))}
                    >
                        <ArrowLeft />
                        Kembali
                    </Button>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => {
                                    const credentials = `username: ${form.data.username}
password: ${form.data.password}
role: ${form.data.role}`;

                                    copy(credentials);
                                }}
                                type="button"
                                variant={"outline"}
                            >
                                {isCopied ? <ClipboardCheck /> : <Clipboard />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Salin Data Pengguna</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
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
                                placeholder="Buat / Generate random password"
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
                                error={form.errors.password}
                            />
                            <InputForm
                                label="Nama Lengkap"
                                placeholder="Masukan nama lengkap"
                                value={form.data.nama_lengkap}
                                onChange={(e) =>
                                    form.setData("nama_lengkap", e.target.value)
                                }
                                error={form.errors.nama_lengkap}
                            />
                            <InputForm
                                label="No. Handphone/Whatsapp"
                                placeholder="Masukan no wa/handphone"
                                value={form.data.no_telp}
                                onChange={(e) =>
                                    form.setData(
                                        "no_telp",
                                        formatIndonesianPhoneNumber(
                                            e.target.value
                                        )
                                    )
                                }
                                type="tel"
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
