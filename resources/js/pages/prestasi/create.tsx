import InputForm from "@/components/InputForm";
import { Select2 } from "@/components/select2";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "@inertiajs/react";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { OptionsSelect2 } from "../absensi/absensiTypes";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/date-picker";
import ButtonForm from "@/components/button-form";
import { SendHorizonal } from "lucide-react";

import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PrestasiCreateModalProps {
    open: boolean;
    onClose: () => void;
    siswas: OptionsSelect2[];
}
type FormPrestasiCreate = {
    siswa_id: string;
    nama_prestasi: string;
    tingkat: string;
    keterangan: string;
    tanggal: string;
};

export default function PrestasiCreateModal({
    open,
    onClose,
    siswas,
}: PrestasiCreateModalProps) {
    const { data, setData, errors, processing, post, reset } =
        useForm<FormPrestasiCreate>({
            siswa_id: "",
            nama_prestasi: "",
            tingkat: "",
            keterangan: "",
            tanggal: "",
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        post(route("prestasi.store"));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={() => {
                reset();
                onClose();
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogContent className="max-w-5xl" disableOutsideClick={true}>
                    <DialogHeader>
                        <DialogTitle>Tambah Data</DialogTitle>
                        <DialogDescription>
                            Tambah Data Siswa Berprestasi
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div>
                            <Label>Siswa</Label>
                            <Select2
                                placeholder="Pilih Siswa Peraih Prestasi"
                                options={siswas}
                                value={data.siswa_id}
                                onChange={(value) => setData("siswa_id", value)}
                            />
                            {errors.siswa_id && (
                                <span className="text-red-500 mt-1">
                                    {errors.siswa_id}
                                </span>
                            )}
                        </div>
                        <InputForm
                            label="Nama Prestasi"
                            value={data.nama_prestasi}
                            onChange={(e) =>
                                setData("nama_prestasi", e.target.value)
                            }
                            error={errors.nama_prestasi}
                            name="nama_prestasi"
                            placeholder="Masukan Nama Prestasi"
                        />

                        <InputForm
                            label="Tingkat Prestasi"
                            value={data.tingkat}
                            onChange={(e) => setData("tingkat", e.target.value)}
                            error={errors.tingkat}
                            name="tingkat"
                            placeholder="Masukan Tingkat Prestasi"
                        />

                        <div>
                            <Label>Keterangan</Label>
                            <Textarea
                                value={data.keterangan}
                                onChange={(e) =>
                                    setData("keterangan", e.target.value)
                                }
                                placeholder="Masukan Keterangan Prestasi"
                            ></Textarea>
                            {errors.keterangan && (
                                <span className="text-red-500">
                                    {errors.keterangan}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Tanggal Perolehan Prestasi</Label>
                            <DatePicker
                                date={data.tanggal}
                                mode="single"
                                selected={new Date(data.tanggal)}
                                onSelected={(value) =>
                                    setData(
                                        "tanggal",
                                        format(value, "yyyy-MM-dd", {
                                            locale: id,
                                        })
                                    )
                                }
                                placeholder="Masukan Tanggal Perolehan Prestasi"
                                todayAction={() =>
                                    setData(
                                        "tanggal",
                                        format(
                                            new Date().toString(),
                                            "yyyy-MM-dd",
                                            { locale: id }
                                        )
                                    )
                                }
                                captionLayout="dropdown"
                            />
                            {errors.tanggal && (
                                <span className="text-red-500">
                                    {errors.tanggal}
                                </span>
                            )}
                        </div>
                    </div>
                    <ButtonForm
                        label="Submit"
                        righticon={<SendHorizonal />}
                        loading={processing}
                        onClick={handleSubmit}
                    />
                </DialogContent>
            </form>
        </Dialog>
    );
}
