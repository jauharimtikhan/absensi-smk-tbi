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
import { PelanggaranItemType } from ".";

interface PelanggaranUpdateModalProps {
    open: boolean;
    onClose: () => void;
    siswas: OptionsSelect2[];
    pelanggaran: PelanggaranItemType;
}
type FormPelanggaranUpdate = {
    siswa_id: string;
    tindakan_pelanggaran: string;
    keterangan_pelanggaran: string;
    tanggal: string;
};

export default function PelanggaranUpdateModal({
    open,
    onClose,
    siswas,
    pelanggaran,
}: PelanggaranUpdateModalProps) {
    const { data, setData, errors, processing, put, reset } =
        useForm<FormPelanggaranUpdate>({
            siswa_id: String(pelanggaran.siswa_id) || "",
            tindakan_pelanggaran: pelanggaran.tindakan_pelanggaran || "",
            keterangan_pelanggaran: pelanggaran.keterangan_pelanggaran || "",
            tanggal: pelanggaran.tanggal || "",
        });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        put(route("pelanggaran.update", pelanggaran.id));
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
                        <DialogTitle>Update Data</DialogTitle>
                        <DialogDescription>
                            Update Data Pelanggaran Siswa
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div>
                            <Label>Siswa</Label>
                            <Select2
                                placeholder="Pilih Siswa"
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
                        <div>
                            <Label>Keterangan</Label>
                            <Textarea
                                value={data.keterangan_pelanggaran}
                                onChange={(e) =>
                                    setData(
                                        "keterangan_pelanggaran",
                                        e.target.value
                                    )
                                }
                                placeholder="Masukan Keterangan Pelanggaran"
                            ></Textarea>
                            {errors.keterangan_pelanggaran && (
                                <span className="text-red-500">
                                    {errors.keterangan_pelanggaran}
                                </span>
                            )}
                        </div>

                        <div>
                            <Label>Tindakan</Label>
                            <Textarea
                                value={data.tindakan_pelanggaran}
                                onChange={(e) =>
                                    setData(
                                        "tindakan_pelanggaran",
                                        e.target.value
                                    )
                                }
                                placeholder="Masukan Tindakan Penanganan Pelanggaran"
                            ></Textarea>
                            {errors.tindakan_pelanggaran && (
                                <span className="text-red-500">
                                    {errors.tindakan_pelanggaran}
                                </span>
                            )}
                        </div>
                        <div>
                            <Label>Tanggal Pelanggaran</Label>
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
                                placeholder="Masukan Tanggal Pelanggaran"
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
