import React from "react";
import { Separator } from "@/components/ui/separator";
import ButtonForm from "@/components/button-form";
import { Checkbox } from "@/components/ui/checkbox";

import type { SiswaDetail } from "./penggunaTypes";

interface KelasTabContentProps {
    mapelId: number;
    kelas: string;
    kelasGroup: SiswaDetail[];
    attachedSiswa: Record<string, boolean>;
    onAttachDetach: (siswa: SiswaDetail, checked: boolean) => void;
    onDetachAllInKelas: (siswa: SiswaDetail, siswa_ids: string[]) => void;
}

const KelasTabContent = React.memo(
    ({
        mapelId,
        kelas,
        kelasGroup,
        attachedSiswa,
        onAttachDetach,
        onDetachAllInKelas,
    }: KelasTabContentProps) => {
        if (!kelasGroup || kelasGroup.length === 0) return null;

        return (
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
                    <div className="text-sm font-medium text-muted-foreground mb-2 lg:mb-0">
                        Mapel: {kelasGroup[0]?.nama_mapel}
                    </div>
                    <ButtonForm
                        variant="destructive"
                        size="sm"
                        label="Hapus Semua Siswa"
                        onClick={() => {
                            const ids = kelasGroup.map((s) =>
                                String(s.siswa_id)
                            );
                            onDetachAllInKelas(kelasGroup[0], ids);
                        }}
                    />
                </div>

                <div className="space-y-3">
                    {kelasGroup.map((siswa) => (
                        <div
                            key={siswa.siswa_id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                    {siswa.nama_lengkap}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    NIS: {siswa.nis}
                                </div>
                            </div>
                            <Checkbox
                                checked={
                                    attachedSiswa[
                                        `${siswa.siswa_id}-${siswa.mapel_id}`
                                    ] ?? true
                                }
                                onCheckedChange={(val) =>
                                    onAttachDetach(siswa, !!val)
                                }
                                aria-label={`Toggle status ${siswa.nama_lengkap}`}
                            />
                        </div>
                    ))}
                </div>
                <Separator className="mt-4" />
            </div>
        );
    }
);
export default KelasTabContent;
