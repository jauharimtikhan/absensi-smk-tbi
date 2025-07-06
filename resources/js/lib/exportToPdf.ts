import jsPDF from "jspdf";
import autoTable, { CellDef } from "jspdf-autotable";
import { ResultDataType } from "@/pages/laporan/semester";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ResponseExportedData } from "@/types";

type ExportPDFOptions = {
    data: ResponseExportedData[];
    tanggal: string;
    kelas: string;
    typeLaporan: "Semester" | "Mingguan" | "Bulanan";
};

let newKelas: string;

const statusColorMap: Record<string, [number, number, number]> = {
    alpa: [239, 68, 68], // red-500
    izin: [59, 130, 246], // blue-500
    sakit: [234, 179, 8], // yellow-400
    telat: [249, 115, 22], // orange-500
};

export function exportAbsensiPDF({
    data,
    tanggal,
    kelas,
    typeLaporan,
}: ExportPDFOptions) {
    const doc = new jsPDF();
    const groupedByJenis = groupByJenisAbsen(data, kelas);

    doc.setFontSize(14);
    doc.text(`Laporan Absensi Harian`, 14, 15);
    doc.setFontSize(11);
    doc.text(`Tanggal: ${tanggal}`, 14, 22);

    let startY = 35;

    Object.entries(groupedByJenis).forEach(([jenis, jenisItems], index) => {
        const mapelGroups = jenisItems.reduce((acc, item) => {
            const mapelName = item.mapel?.nama_mapel ?? "-";
            if (!acc[mapelName]) acc[mapelName] = [];
            acc[mapelName].push(item);
            return acc;
        }, {} as Record<string, ResponseExportedData[]>);

        Object.entries(mapelGroups).forEach(([mapelNama, items]) => {
            if (index > 0 || startY > 35) startY += 10;

            const guruNama =
                items[0]?.guru?.role !== "super-admin"
                    ? items[0]?.guru?.profile_guru?.nama_guru ?? "-"
                    : "Super Admin";

            const kelasNama = items[0]?.kelas?.nama_kelas ?? "-";

            doc.setFontSize(12);
            doc.text(
                `Jenis Absen: ${jenis.replace("_", " ").toUpperCase()}`,
                14,
                startY
            );
            startY += 6;

            doc.setFontSize(10);
            doc.text(`Mata Pelajaran: ${mapelNama}`, 14, startY);
            startY += 5;

            doc.text(`Guru: ${guruNama}`, 14, startY);
            startY += 5;

            doc.text(`Kelas: ${kelasNama}`, 14, startY);
            startY += 6;

            autoTable(doc, {
                startY,
                head: [
                    [
                        { content: "No", styles: { fillColor: [80, 80, 160] } },
                        {
                            content: "NIS",
                            styles: { fillColor: [80, 80, 160] },
                        },
                        {
                            content: "Nama",
                            styles: { fillColor: [80, 80, 160] },
                        },
                        {
                            content: "JML",
                            styles: { fillColor: [80, 80, 160] },
                            colSpan: 4,
                        },
                    ],
                    [
                        "", // Empty for No
                        "", // Empty for NIS
                        "", // Empty for Nama Lengkap
                        {
                            content: "I",
                            styles: {
                                halign: "center",
                                fillColor: [22, 72, 99],
                            },
                        },
                        {
                            content: "S",
                            styles: {
                                halign: "center",
                                fillColor: [22, 72, 99],
                            },
                        },
                        {
                            content: "A",
                            styles: {
                                halign: "center",
                                fillColor: [22, 72, 99],
                            },
                        },
                        {
                            content: "T",
                            styles: {
                                halign: "center",
                                fillColor: [22, 72, 99],
                            },
                        },
                    ],
                ],
                body: items.map((item, i) => {
                    return [
                        {
                            content: (index + 1).toString(),
                            styles: { halign: "center", cellWidth: 10 },
                        },
                        {
                            content: item.nis || "-",
                            styles: { halign: "center", cellWidth: 25 },
                        },
                        {
                            content: item.nama_siswa || "-",
                            styles: { cellWidth: 70 },
                        },
                        {
                            content:
                                item.jml.izin === 0
                                    ? "-"
                                    : item.jml.izin.toString(),
                            styles: { halign: "center", cellWidth: 15 },
                        },
                        {
                            content:
                                item.jml.sakit === 0
                                    ? "-"
                                    : item.jml.sakit.toString(),
                            styles: { halign: "center", cellWidth: 15 },
                        },
                        {
                            content:
                                item.jml.alpa === 0
                                    ? "-"
                                    : item.jml.alpa.toString(),
                            styles: { halign: "center", cellWidth: 15 },
                        },
                        {
                            content:
                                item.jml.telat === 0
                                    ? "-"
                                    : item.jml.telat.toString(),
                            styles: { halign: "center", cellWidth: 15 },
                        },
                    ] as CellDef[];
                }),
                styles: {
                    fontSize: 9,
                },
                theme: "grid",
            });

            startY = (doc as any).lastAutoTable.finalY;
        });
    });

    doc.save(`Laporan_${typeLaporan}_${kelas}_${tanggal}.pdf`);
}

function groupByJenisAbsen(data: ResponseExportedData[], kelas: string) {
    return data.reduce<Record<string, ResponseExportedData[]>>((acc, curr) => {
        newKelas = kelas !== "-" ? kelas : curr.kelas.nama_kelas;
        const key = curr.jenis_absen || "Keseluruhan";
        if (!acc[key]) acc[key] = [];
        acc[key].push(curr);
        return acc;
    }, {});
}
