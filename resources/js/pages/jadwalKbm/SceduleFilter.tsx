// resources/js/Components/Schedule/ScheduleFilters.tsx
import React from "react";
import { FilterOptions } from "@/types/schedule";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ScheduleFiltersProps {
    filterOptions: FilterOptions;
    filters: {
        hari: string;
        kelas_id: string;
        guru_id: string;
        mapel_id: string;
    };
    onFilterChange: (filters: any) => void;
}

const ScheduleFilters: React.FC<ScheduleFiltersProps> = ({
    filterOptions,
    filters,
    onFilterChange,
}) => {
    const handleChange = (name: string, value: string) => {
        onFilterChange({ ...filters, [name]: value });
    };

    const resetFilters = () => {
        onFilterChange({ hari: "", kelas_id: "", guru_id: "", mapel_id: "" });
    };

    return (
        <div className="bg-background rounded-lg border p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Hari
                    </label>
                    <Select
                        value={filters.hari}
                        onValueChange={(value) => handleChange("hari", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Hari" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Hari</SelectItem>
                            {filterOptions.hari.map((day) => (
                                <SelectItem key={day} value={day}>
                                    {day}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Kelas
                    </label>
                    <Select
                        value={filters.kelas_id}
                        onValueChange={(value) =>
                            handleChange("kelas_id", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Kelas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Kelas</SelectItem>
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
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Guru
                    </label>
                    <Select
                        value={filters.guru_id}
                        onValueChange={(value) =>
                            handleChange("guru_id", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Guru" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Guru</SelectItem>
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
                </div>

                <div>
                    <label className="text-sm font-medium mb-2 block">
                        Mata Pelajaran
                    </label>
                    <Select
                        value={filters.mapel_id}
                        onValueChange={(value) =>
                            handleChange("mapel_id", value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Mapel" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Mata Pelajaran
                            </SelectItem>
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
                </div>

                <div className="flex items-end">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={resetFilters}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleFilters;
