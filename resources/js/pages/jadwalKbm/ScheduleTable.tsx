// resources/js/Components/Schedule/ScheduleTable.tsx
import React, { useState } from "react";
import { Schedule } from "@/types/schedule";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScheduleTableProps {
    schedules: Schedule[];
    onEdit: (schedule: Schedule) => void;
}

type SortField = "hari" | "waktu_mulai" | "mata_pelajarans" | "kelas";
type SortDirection = "asc" | "desc";

const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onEdit }) => {
    const [sortField, setSortField] = useState<SortField>("hari");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const sortedSchedules = [...schedules].sort((a, b) => {
        let compareValue = 0;

        if (sortField === "hari") {
            const days = [
                "senin",
                "selasa",
                "rabu",
                "kamis",
                "jumat",
                "sabtu",
                "minggu",
            ];
            compareValue =
                days.indexOf(a.hari.toLowerCase()) -
                days.indexOf(b.hari.toLowerCase());
        } else if (sortField === "waktu_mulai") {
            compareValue = a.jam_mulai.localeCompare(b.jam_mulai);
        } else if (sortField === "mata_pelajarans") {
            compareValue = a.mata_pelajarans.nama_mapel.localeCompare(
                b.mata_pelajarans.nama_mapel
            );
        } else if (sortField === "kelas") {
            compareValue = a.kelas.nama_kelas.localeCompare(b.kelas.nama_kelas);
        }

        return sortDirection === "asc" ? compareValue : -compareValue;
    });

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (field: SortField) => {
        if (sortField !== field)
            return <ArrowUpDown className="ml-1 h-3 w-3" />;
        return sortDirection === "asc" ? (
            <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
            <ChevronDown className="ml-1 h-4 w-4" />
        );
    };

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader className="bg-gray-50">
                    <TableRow>
                        <TableHead>
                            <Button
                                variant="ghost"
                                className="px-0 font-semibold"
                                onClick={() => handleSort("hari")}
                            >
                                Hari {getSortIcon("hari")}
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                className="px-0 font-semibold"
                                onClick={() => handleSort("waktu_mulai")}
                            >
                                Waktu {getSortIcon("waktu_mulai")}
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                className="px-0 font-semibold"
                                onClick={() => handleSort("mata_pelajarans")}
                            >
                                Mata Pelajaran {getSortIcon("mata_pelajarans")}
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button
                                variant="ghost"
                                className="px-0 font-semibold"
                                onClick={() => handleSort("kelas")}
                            >
                                Kelas {getSortIcon("kelas")}
                            </Button>
                        </TableHead>
                        <TableHead className="font-semibold">Guru</TableHead>
                        <TableHead className="text-right font-semibold">
                            Aksi
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedSchedules.map((schedule) => (
                        <TableRow
                            key={schedule.id}
                            className="hover:bg-gray-50"
                        >
                            <TableCell>
                                <Badge variant="outline" className="capitalize">
                                    {schedule.hari}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">
                                    {format(
                                        parseISO(
                                            `1970-01-01T${schedule.jam_mulai}`
                                        ),
                                        "HH:mm"
                                    )}{" "}
                                    -
                                    {format(
                                        parseISO(
                                            `1970-01-01T${schedule.jam_selesai}`
                                        ),
                                        "HH:mm"
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">
                                    {schedule.mata_pelajarans.nama_mapel}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {schedule.mata_pelajarans.kode_mapel}
                                </div>
                            </TableCell>
                            <TableCell>{schedule.kelas.nama_kelas}</TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">
                                        {schedule.guru.profile_guru?.nama_guru
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    {schedule.guru.profile_guru?.nama_guru}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onEdit(schedule)}
                                >
                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {schedules.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                    Tidak ada jadwal yang ditemukan
                </div>
            )}
        </div>
    );
};

export default ScheduleTable;
