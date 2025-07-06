import React, { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SiswaGroupedMap, SiswaDetail } from "./penggunaTypes";

import KelasTabContent from "./KelasTabContent";

type Props = {
    siswaGrouped: SiswaGroupedMap;
    attachedSiswa: Record<string, boolean>;
    onAttachDetach: (siswa: SiswaDetail, checked: boolean) => void;
    onDetachAllInKelas: (siswa: SiswaDetail, siswa_ids: string[]) => void;
};

export default function KelolaSiswaTabs({
    siswaGrouped,
    attachedSiswa,
    onAttachDetach,
    onDetachAllInKelas,
}: Props) {
    const kelasList = useMemo(() => {
        const kelasSet = new Set<string>();
        Object.values(siswaGrouped).forEach((kelasMap) => {
            Object.keys(kelasMap).forEach((kelas) => kelasSet.add(kelas));
        });
        return Array.from(kelasSet);
    }, [siswaGrouped]);

    if (kelasList.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Kelola Siswa</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-6">
                        Tidak ada data siswa yang ditemukan
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Kelola Siswa</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={kelasList[0]} className="space-y-4">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {kelasList.map((kelas) => (
                            <TabsTrigger key={kelas} value={kelas}>
                                {kelas}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {kelasList.map((kelas) => (
                        <TabsContent key={kelas} value={kelas}>
                            <ScrollArea className="h-[300px]">
                                {Object.entries(siswaGrouped).map(
                                    ([mapelId, kelasGroup]) => {
                                        // Konversi mapelId dari string ke number
                                        const mapelIdNum = parseInt(
                                            mapelId,
                                            10
                                        );
                                        return (
                                            kelasGroup[kelas] && (
                                                <KelasTabContent
                                                    key={mapelId}
                                                    mapelId={mapelIdNum}
                                                    kelas={kelas}
                                                    kelasGroup={
                                                        kelasGroup[kelas]
                                                    }
                                                    attachedSiswa={
                                                        attachedSiswa
                                                    }
                                                    onAttachDetach={
                                                        onAttachDetach
                                                    }
                                                    onDetachAllInKelas={
                                                        onDetachAllInKelas
                                                    }
                                                />
                                            )
                                        );
                                    }
                                )}
                            </ScrollArea>
                        </TabsContent>
                    ))}
                </Tabs>
            </CardContent>
        </Card>
    );
}
