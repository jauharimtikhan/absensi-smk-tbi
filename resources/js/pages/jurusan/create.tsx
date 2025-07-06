import React, { FormEvent } from "react";
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

interface JurusanCreateProps {
    visible: boolean;
    onClose: () => void;
}

export default function JurusanCreate({
    visible,
    onClose,
}: JurusanCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        kode_jurusan: "",
        nama_jurusan: "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("jurusan.store"));
    };
    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent disableOutsideClick={true}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Buat Data</DialogTitle>
                        <DialogDescription>
                            Tambah data jurusan baru.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <InputForm
                            label="Nama jurusan baru"
                            placeholder="Masukan nama jurusan baru disini!"
                            value={data.nama_jurusan}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("nama_jurusan", value);
                                setData("kode_jurusan", generateSlug(value));
                            }}
                            error={errors.nama_jurusan}
                        />
                        <InputForm
                            label="Kode jurusan"
                            hint="Otomatis terisi dari nama jurusan baru!, atau anda bisa membuat kode jurusan sendiri!"
                            placeholder="Otomatis terisi dari nama jurusan baru!"
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
