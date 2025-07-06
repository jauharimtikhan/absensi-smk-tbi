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

interface JurusanUpdateProps {
    visible: boolean;
    onClose: () => void;
    dataJurusan?: any;
}

export default function JurusanUpdate({
    visible,
    onClose,
    dataJurusan,
}: JurusanUpdateProps) {
    const { data, setData, put, processing, errors } = useForm({
        kode_jurusan: dataJurusan?.kode_jurusan || "",
        nama_jurusan: dataJurusan?.nama_jurusan || "",
        id: dataJurusan?.id || "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(
            route("jurusan.update", {
                id: data.id,
            })
        );
    };

    useEffect(() => {
        if (dataJurusan) {
            setData("kode_jurusan", dataJurusan.kode_jurusan);
            setData("nama_jurusan", dataJurusan.nama_jurusan);
            setData("id", dataJurusan.id);
        }
    }, [dataJurusan]);
    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent disableOutsideClick={true}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ubah Data</DialogTitle>
                        <DialogDescription>
                            Update data jurusan.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <InputForm
                            label="Nama kelas baru"
                            placeholder="Masukan nama kelas baru disini!"
                            value={data.nama_jurusan}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("nama_jurusan", value);
                                setData("kode_jurusan", generateSlug(value));
                            }}
                            error={errors.nama_jurusan}
                        />
                        <InputForm
                            label="Kode Kelas"
                            hint="Otomatis terisi dari nama kelas baru!, atau anda bisa membuat kode kelas sendiri!"
                            placeholder="Otomatis terisi dari nama kelas baru!"
                            value={data.kode_jurusan}
                            onChange={(e) =>
                                setData("kode_jurusan", e.target.value)
                            }
                            error={errors.kode_jurusan}
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
