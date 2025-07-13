// resources/js/Components/Schedule/ScheduleForm.tsx
import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "@inertiajs/react";
import { FilterOptions, Schedule, ScheduleFormData } from "@/types/schedule";

interface ScheduleFormProps {
    open: boolean;
    onClose: () => void;
    schedule?: Schedule | null;
    filterOptions: FilterOptions;
}

const ScheduleForm: React.FC<ScheduleFormProps> = ({
    open,
    onClose,
    schedule,
    filterOptions,
}) => {
    const { data, setData, post, put, processing, errors, reset } =
        useForm<ScheduleFormData>({
            hari: "",
            jam_mulai: "",
            jam_selesai: "",
            mapel_id: 0,
            guru_id: 0,
            kelas_id: 0,
        });

    useEffect(() => {
        if (schedule) {
            setData({
                hari: schedule.hari,
                jam_mulai: schedule.jam_mulai,
                jam_selesai: schedule.jam_selesai,
                mapel_id: schedule.mata_pelajarans.id,
                guru_id: schedule.guru.id,
                kelas_id: schedule.kelas.id,
            });
        } else {
            reset();
        }
    }, [schedule]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (schedule) {
            put(`/jadwal-kbm/${schedule.id}`, {
                onSuccess: () => {
                    toast.success("Jadwal berhasil diperbarui");
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal memperbarui jadwal");
                },
            });
        } else {
            post("/jadwal-kbm", {
                onSuccess: () => {
                    toast.success("Jadwal berhasil ditambahkan");
                    onClose();
                },
                onError: () => {
                    toast.error("Gagal menambahkan jadwal");
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {schedule ? "Edit Jadwal KBM" : "Tambah Jadwal KBM"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="hari">Hari</Label>
                            <Select
                                value={data.hari}
                                onValueChange={(value) =>
                                    setData("hari", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Hari" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterOptions.hari.map((day) => (
                                        <SelectItem
                                            className="capitalize"
                                            key={day}
                                            value={day}
                                        >
                                            {day}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.hari && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.hari}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="kelas_id">Kelas</Label>
                            <Select
                                value={data.kelas_id.toString()}
                                onValueChange={(value) =>
                                    setData("kelas_id", parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterOptions.kelas.map((kelas) => (
                                        <SelectItem
                                            key={kelas.id}
                                            value={kelas.id.toString()}
                                        >
                                            {kelas.nama_kelas}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.kelas_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.kelas_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="mapel_id">Mata Pelajaran</Label>
                            <Select
                                value={data.mapel_id.toString()}
                                onValueChange={(value) =>
                                    setData("mapel_id", parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterOptions.mapel.map((mapel) => (
                                        <SelectItem
                                            key={mapel.id}
                                            value={mapel.id.toString()}
                                        >
                                            {mapel.nama_mapel}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.mapel_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.mapel_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="guru_id">Guru</Label>
                            <Select
                                value={data.guru_id.toString()}
                                onValueChange={(value) =>
                                    setData("guru_id", parseInt(value))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Guru" />
                                </SelectTrigger>
                                <SelectContent>
                                    {filterOptions.guru.map((guru) => (
                                        <SelectItem
                                            key={guru.id}
                                            value={guru.id.toString()}
                                        >
                                            {guru.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.guru_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.guru_id}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="jam_mulai">Waktu Mulai</Label>
                            <Input
                                type="time"
                                id="jam_mulai"
                                value={data.jam_mulai}
                                onChange={(e) =>
                                    setData("jam_mulai", e.target.value)
                                }
                            />
                            {errors.jam_mulai && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.jam_mulai}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="jam_selesai">Waktu Selesai</Label>
                            <Input
                                type="time"
                                id="jam_selesai"
                                value={data.jam_selesai}
                                onChange={(e) =>
                                    setData("jam_selesai", e.target.value)
                                }
                            />
                            {errors.jam_selesai && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.jam_selesai}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? "Menyimpan..."
                                : schedule
                                ? "Perbarui"
                                : "Simpan"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleForm;
