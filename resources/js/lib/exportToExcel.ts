import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ResultDataType } from "@/pages/laporan/semester";

export function exportGroupedExcel(
    data: ResultDataType[],
    tanggal: string,
    kelas: string,
    filename = "Laporan_Absensi.xlsx"
) {
    if (!data || data.length === 0) return;

    const grouped = data.reduce((acc, item) => {
        const key = item.jenis_absen ?? "Tanpa Jenis Absen";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {} as Record<string, ResultDataType[]>);

    const wb = XLSX.utils.book_new();

    Object.entries(grouped).forEach(([jenisAbsen, items]) => {
        const sheetData: (string | number)[][] = [];

        // Header info
        sheetData.push([`Laporan Absensi - ${jenisAbsen.toUpperCase()}`]);
        sheetData.push([`Tanggal: ${formatTanggal(tanggal)}`]);
        sheetData.push([`Kelas: ${kelas}`]);
        sheetData.push([]); // Kosongkan baris

        // Header tabel
        const tableHeader = [
            "No",
            "NIS",
            "Nama Lengkap",
            "Status",
            "Kelas",
            "Tanggal",
            "Guru",
        ];
        sheetData.push(tableHeader);

        // Data siswa
        items.forEach((item, idx) => {
            sheetData.push([
                idx + 1,
                item.siswa?.nis ?? "-",
                item.siswa?.nama_lengkap ?? "-",
                item.status,
                item.kelas?.nama_kelas ?? "-",
                formatTanggal(item.tanggal),
                item.guru?.username ?? "-",
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(sheetData);

        // Merge cells untuk Judul
        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Judul
            { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // Tanggal
            { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }, // Kelas
        ];

        // Set lebar kolom otomatis (basic)
        const colWidths = tableHeader.map(() => ({ wch: 20 }));
        ws["!cols"] = colWidths;

        XLSX.utils.book_append_sheet(wb, ws, jenisAbsen);
    });

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), filename);
}

function formatTanggal(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}
