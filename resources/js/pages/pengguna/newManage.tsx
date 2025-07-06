import React, { useCallback, useState } from "react";
import { router, useForm } from "@inertiajs/react";
import { ArrowLeft, Save, Search } from "lucide-react";
import toast from "react-hot-toast";

import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { PageProps } from "@/types";
import useToast from "@/hooks/useToast";
import { Select2 } from "@/components/select2";
import ButtonForm from "@/components/button-form";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import type { OptionsSelect2 } from "../absensi/absensiTypes";
import type {
    GuruDetailWithGrouping,
    SiswaGroupedMap,
    SiswaDetail,
} from "./penggunaTypes";

import AttachMapelToSiswa from "./AttachSiswaToMapel";
import KelolaSiswaTabs from "./ManageSiswaGroup";
import { SearchForm } from "./SearchForm";

interface PenggunaManagepageProps extends PageProps {
    kelases: OptionsSelect2[];
    mapels: OptionsSelect2[];
    guru_id: string;
}

export default function PenggunaManagePage({
    alert,
    kelases,
    mapels,
    guru_id,
    auth,
}: PenggunaManagepageProps) {
    useToast(alert);
    const [detailGuru, setDetailGuru] = useState<GuruDetailWithGrouping>();
    const [loadingGetDetailGuru, setLoadingGetDetailGuru] = useState(false);
    const [attachedSiswa, setAttachedSiswa] = useState<Record<string, boolean>>(
        {}
    );
    const [attachSiswaToMapelIds, setAttachSiswaToMapelIds] = useState<
        number[]
    >([]);

    const form = useForm({
        id_kelas: "",
        id_mapel: "",
    });

    const fetchDataDetailGuru = useCallback(async () => {
        if (!form.data.id_mapel || !form.data.id_kelas) {
            toast.error("Mapel & Kelas harus diisi!");
            return;
        }

        setLoadingGetDetailGuru(true);
        try {
            const res = await window.axios.get(
                route("user.get.detailguru", guru_id),
                { params: { mapel_id: form.data.id_mapel } }
            );

            if (res.status === 200) {
                setDetailGuru(res.data.data);
            }
        } catch (error) {
            console.error("Gagal mengambil detail guru:", error);
            toast.error("Gagal mengambil data guru");
        } finally {
            setLoadingGetDetailGuru(false);
        }
    }, [form.data, guru_id]);

    const handleAttachSiswa = useCallback(async () => {
        if (
            !form.data.id_kelas ||
            !form.data.id_mapel ||
            !attachSiswaToMapelIds.length
        ) {
            toast.error("Harap pilih kelas, mapel, dan setidaknya satu siswa");
            return;
        }

        try {
            const res = await window.axios.post(route("user.siswa.attach"), {
                mapel_id: form.data.id_mapel,
                siswa_ids: attachSiswaToMapelIds,
                kelas_id: form.data.id_kelas,
                user_id:
                    auth.user.role === "super-admin" ? guru_id : auth.user.id,
            });

            if (res.status === 200) {
                toast.success(res.data.message);
                await fetchDataDetailGuru();
            }
        } catch (error) {
            console.error("Gagal menambahkan siswa:", error);
            toast.error("Gagal menambahkan siswa ke mapel");
        }
    }, [form.data, attachSiswaToMapelIds, fetchDataDetailGuru]);

    const handleAttachDetach = useCallback(
        async (siswa: SiswaDetail, checked: boolean) => {
            try {
                const routeName = checked
                    ? "user.siswa.attach"
                    : "user.siswa.detach";
                const res = await window.axios.post(route(routeName), {
                    siswa_ids: [siswa.siswa_id],
                    mapel_id: siswa.mapel_id,
                    user_id:
                        auth.user.role === "super-admin"
                            ? guru_id
                            : auth.user.id, // Menggunakan ID user dari auth
                });

                if (res.data.success) {
                    toast.success(res.data.message);
                    setAttachedSiswa((prev) => ({
                        ...prev,
                        [`${siswa.siswa_id}-${siswa.mapel_id}`]: checked,
                    }));
                } else {
                    toast.error(res.data.message || "Operasi gagal");
                }
            } catch (error) {
                console.error("Gagal mengubah status siswa:", error);
                toast.error("Terjadi kesalahan server");
            }
        },
        [auth.user.id]
    );

    const handleDetachAllInKelas = useCallback(
        async (siswa: SiswaDetail, siswa_ids: string[]) => {
            try {
                const res = await window.axios.post(
                    route("user.siswa.detach"),
                    {
                        mapel_id: siswa.mapel_id,
                        siswa_ids: siswa_ids,
                        user_id:
                            auth.user.role === "super-admin"
                                ? guru_id
                                : auth.user.id,
                    }
                );

                if (res.data.success) {
                    toast.success(res.data.message);
                    // Refresh data setelah menghapus
                    await fetchDataDetailGuru();
                }
            } catch (error) {
                console.error("Gagal menghapus siswa:", error);
                toast.error("Gagal menghapus siswa");
            }
        },
        [fetchDataDetailGuru]
    );

    const hasSiswaData =
        detailGuru && Object.keys(detailGuru.siswa_grouped).length > 0;

    return (
        <AuthenticatedLayout title="Kelola Siswa">
            <div className="flex items-center gap-3 self-end mb-4">
                <ButtonForm
                    label="Kembali"
                    lefticon={<ArrowLeft size={16} />}
                    onClick={() => router.get(route("user.index"))}
                    variant="outline"
                />
                <ButtonForm
                    label="Simpan"
                    righticon={<Save size={16} />}
                    onClick={handleAttachSiswa}
                />
            </div>

            <SearchForm
                kelases={kelases}
                mapels={mapels}
                form={form}
                loading={loadingGetDetailGuru}
                onSearch={fetchDataDetailGuru}
            />

            {!detailGuru ? null : hasSiswaData ? (
                <KelolaSiswaTabs
                    siswaGrouped={detailGuru.siswa_grouped}
                    attachedSiswa={attachedSiswa}
                    onAttachDetach={handleAttachDetach}
                    onDetachAllInKelas={handleDetachAllInKelas}
                />
            ) : (
                <AttachMapelToSiswa
                    id_kelas={Number(form.data.id_kelas)}
                    id_mapel={Number(form.data.id_mapel)}
                    returnData={setAttachSiswaToMapelIds}
                />
            )}
        </AuthenticatedLayout>
    );
}
