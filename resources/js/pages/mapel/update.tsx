import { MapelResponseType } from ".";
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

interface MapelUpdateProps {
    visible: boolean;
    onClose: () => void;
    dataMapel?: MapelResponseType;
}

export default function MapelUpdate({
    visible,
    onClose,
    dataMapel,
}: MapelUpdateProps) {
    const { data, setData, put, processing, errors } = useForm({
        kode_mapel: dataMapel?.kode_mapel || "",
        nama_mapel: dataMapel?.nama_mapel || "",
        id: dataMapel?.id || "",
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(
            route("mapel.update", {
                id: data.id,
            })
        );
    };

    useEffect(() => {
        if (dataMapel) {
            setData("kode_mapel", dataMapel.kode_mapel);
            setData("nama_mapel", dataMapel.nama_mapel);
            setData("id", dataMapel.id);
        }
    }, [dataMapel]);
    return (
        <Dialog open={visible} onOpenChange={onClose}>
            <DialogContent disableOutsideClick={true}>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Ubah Data</DialogTitle>
                        <DialogDescription>
                            Update data mata pelajaran.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <InputForm
                            label="Nama mata pelajaran baru"
                            placeholder="Masukan nama mata pelajaran baru disini!"
                            value={data.nama_mapel}
                            onChange={(e) => {
                                const value = e.target.value;
                                setData("nama_mapel", value);
                                setData("kode_mapel", generateSlug(value));
                            }}
                            error={errors.nama_mapel}
                        />
                        <InputForm
                            label="Kode Mata Pelajaran"
                            hint="Otomatis terisi dari nama mata pelajaran baru!, atau anda bisa membuat kode mapel sendiri!"
                            placeholder="Otomatis terisi dari nama mata pelajaran baru!"
                            value={data.kode_mapel}
                            onChange={(e) =>
                                setData("kode_mapel", e.target.value)
                            }
                            error={errors.kode_mapel}
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
