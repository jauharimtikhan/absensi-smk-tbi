import { ResultDataType } from "@/pages/laporan/semester";
import { ResponseExportedData } from "@/types";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
interface ExportStyledExcelProps {
    data: ResponseExportedData[];
    tanggal: string;
    kelas: string;
    type?: "harian" | "mingguan" | "bulanan";
}
export async function exportStyledExcel({
    data,
    tanggal,
    type = "harian",
    kelas,
}: ExportStyledExcelProps) {
    const workbook = new ExcelJS.Workbook();
    let newKelas;

    const statusColors: Record<string, string> = {
        alpa: "FF0000", // red-500
        izin: "3B82F6", // blue-500
        sakit: "FACC15", // yellow-400
        telat: "FB923C", // orange-500
    };

    // Group by Guru
    const guruGroups = data.reduce((acc, item) => {
        const guruName =
            item.guru?.role !== "super-admin"
                ? item.guru?.profile_guru?.nama_guru || "Super Admin"
                : "Super Admin";
        if (!acc[guruName]) acc[guruName] = [];
        acc[guruName].push(item);
        return acc;
    }, {} as Record<string, ResponseExportedData[]>);

    for (const [guruName, guruData] of Object.entries(guruGroups)) {
        // Group by Jenis Absen
        const jenisGroups = guruData.reduce((acc, item) => {
            const jenis =
                item.jenis_absen?.replace("_", " ").toUpperCase() ||
                "Keseluruhan";
            if (!acc[jenis]) acc[jenis] = [];
            acc[jenis].push(item);
            return acc;
        }, {} as Record<string, ResponseExportedData[]>);

        for (const [jenisAbsen, jenisData] of Object.entries(jenisGroups)) {
            // Group by Mapel
            const mapelGroups = jenisData.reduce((acc, item) => {
                const mapelName = item.mapel?.nama_mapel ?? "-";
                if (!acc[mapelName]) acc[mapelName] = [];
                acc[mapelName].push(item);
                return acc;
            }, {} as Record<string, ResponseExportedData[]>);

            for (const [mapelName, entries] of Object.entries(mapelGroups)) {
                if (kelas !== "-") {
                    newKelas = kelas;
                } else {
                    newKelas = entries[0]?.kelas?.nama_kelas ?? "Tanpa Kelas";
                }

                const sheetName =
                    `${newKelas}-${guruName}-${jenisAbsen}-${mapelName}`.substring(
                        0,
                        31
                    );
                const worksheet = workbook.addWorksheet(sheetName);

                // Headers
                worksheet.mergeCells("A1", "G1");
                worksheet.getCell(
                    "A1"
                ).value = `Laporan Absensi - ${jenisAbsen} - ${guruName}`;
                worksheet.getCell("A1").font = { size: 14, bold: true };
                worksheet.getCell("A1").alignment = { horizontal: "center" };

                worksheet.mergeCells("A2", "G2");
                worksheet.getCell("A2").value = `${
                    type === "bulanan" ? "Periode" : "Tanggal"
                }: ${type === "harian" ? formatTanggal(tanggal) : tanggal}`;
                worksheet.getCell("A2").alignment = { horizontal: "center" };

                worksheet.mergeCells("A3", "G3");
                worksheet.getCell("A3").value = `Kelas: ${newKelas}`;
                worksheet.getCell("A3").alignment = { horizontal: "center" };

                worksheet.mergeCells("A4", "G4");
                worksheet.getCell("A4").value = `Mata Pelajaran: ${mapelName}`;
                worksheet.getCell("A4").alignment = { horizontal: "center" };

                worksheet.addRow([]); // Empty Row

                const headerRow = worksheet.addRow([
                    "No",
                    "NIS",
                    "Nama Lengkap",
                    "JML",
                ]);

                // Style header
                headerRow.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFDCEEFF" },
                    };
                    cell.font = { bold: true };
                    cell.alignment = {
                        horizontal: "center",
                        vertical: "middle",
                    };
                    cell.border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
                headerRow.worksheet.mergeCells("D6", "G6");
                headerRow.worksheet.mergeCells("A6", "A7");
                headerRow.worksheet.mergeCells("B6", "B7");
                headerRow.worksheet.mergeCells("C6", "C7");
                entries.forEach((item, idx) => {
                    const row = worksheet.addRow([
                        idx + 1,
                        item?.nis ?? "-",
                        item?.nama_siswa ?? "-",
                        item.jml.izin === 0 ? "-" : item.jml.izin,
                        item.jml.sakit === 0 ? "-" : item.jml.sakit,
                        item.jml.alpa === 0 ? "-" : item.jml.alpa,
                        item.jml.telat === 0 ? "-" : item.jml.telat,
                    ]);
                    worksheet.getCell("D7").value = "I";
                    worksheet.getCell("D7").fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFDCEEFF" },
                    };
                    worksheet.getCell("D7").border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                    worksheet.getCell("E7").value = "S";
                    worksheet.getCell("E7").fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFDCEEFF" },
                    };
                    worksheet.getCell("E7").border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                    worksheet.getCell("F7").value = "A";
                    worksheet.getCell("F7").fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFDCEEFF" },
                    };
                    worksheet.getCell("F7").border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                    worksheet.getCell("G7").value = "T";
                    worksheet.getCell("G7").fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFDCEEFF" },
                    };
                    worksheet.getCell("G7").border = {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    };
                    // Warna untuk status selain hadir

                    row.getCell(4).alignment = { horizontal: "center" };
                    row.getCell(5).alignment = { horizontal: "center" };
                    row.getCell(6).alignment = { horizontal: "center" };
                    row.getCell(7).alignment = { horizontal: "center" };
                });

                // Column Widths
                const columnWidths = [5, 12, 50, 3, 3, 3, 3];
                columnWidths.forEach((width, index) => {
                    worksheet.getColumn(index + 1).width = width;
                });
            }
        }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `Laporan_Absensi_${kelas}_${tanggal}.xlsx`);
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
