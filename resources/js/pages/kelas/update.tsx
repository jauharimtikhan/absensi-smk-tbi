import React, { FormEvent, useEffect } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import InputForm from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import ButtonForm from "@/components/button-form";
import { SendHorizontal } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { generateSlug } from "@/lib/utils";

interface KelasUpdateProps {
    visible: boolean;
    onClose: () => void;
    dataKelas?: any;
}

export default function KelasUpdate({
    visible,
    onClose,
    dataKelas,
}: KelasUpdateProps) {
    const { data, setData, put, processing, errors } = useForm({
        kode_kelas: dataKelas?.kode_kelas || "",
        nama_kelas: dataKelas?.nama_kelas || "",
        id: dataKelas?.id || "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(
            route("kelas.update", {
                id: data.id,
            })
        );
    };

    useEffect(() => {
        if (dataKelas) {
            setData("kode_kelas", dataKelas.kode_kelas);
            setData("nama_kelas", dataKelas.nama_kelas);
            setData("id", dataKelas.id);
        }
    }, [dataKelas]);
    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent disableOutsideClick={true}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ubah Data</DialogTitle>
                        <DialogDescription>
                            Update data kelas.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <InputForm
                            label="Nama kelas baru"
                            placeholder="Masukan nama kelas baru disini!"
                            value={data.nama_kelas}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("nama_kelas", value);
                                setData("kode_kelas", generateSlug(value));
                            }}
                            error={errors.nama_kelas}
                        />
                        <InputForm
                            label="Kode Kelas"
                            hint="Otomatis terisi dari nama kelas baru!, atau anda bisa membuat kode kelas sendiri!"
                            placeholder="Otomatis terisi dari nama kelas baru!"
                            value={data.kode_kelas}
                            onChange={(e) =>
                                setData("kode_kelas", e.target.value)
                            }
                            error={errors.kode_kelas}
                        />
                    </div>
                    <DialogFooter>
                        <ButtonForm
                            variant="default"
                            label="Submit"
                            righticon={<SendHorizontal />}
                            loading={processing}
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
