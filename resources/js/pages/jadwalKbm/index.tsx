// resources/js/Pages/Schedule/Index.tsx
import React, { useState } from "react";
import AuthenticatedLayout from "@/layout/AuthenticatedLayout";
import { FilterOptions, Schedule } from "@/types/schedule";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ScheduleFilters from "./SceduleFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleCalendar from "./ScheduleCalendar";
import ScheduleTable from "./ScheduleTable";
import ScheduleForm from "./ScheduleForm";
import { BaseResponsePagination } from "@/types";

interface SchedulePageProps {
    schedules: BaseResponsePagination<Schedule>;
    filterOptions: FilterOptions;
}

const SchedulePage: React.FC<SchedulePageProps> = ({
    schedules,
    filterOptions,
}) => {
    const [view, setView] = useState<"calendar" | "table">("calendar");
    const [filters, setFilters] = useState({
        hari: "",
        kelas_id: "",
        guru_id: "",
        mapel_id: "",
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
        null
    );

    const filteredSchedules = schedules.data.filter((schedule) => {
        return (
            (filters.hari ? schedule.hari === filters.hari : true) &&
            (filters.kelas_id
                ? schedule.kelas.id.toString() === filters.kelas_id
                : true) &&
            (filters.guru_id
                ? schedule.guru.id.toString() === filters.guru_id
                : true) &&
            (filters.mapel_id
                ? schedule.mata_pelajarans.id.toString() === filters.mapel_id
                : true)
        );
    });

    const handleEdit = (schedule: Schedule) => {
        setSelectedSchedule(schedule);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedSchedule(null);
    };

    return (
        <AuthenticatedLayout title="Manajemen Jadwal KBM">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Manajemen Jadwal KBM
                        </h1>
                        <p className="text-muted-foreground">
                            Kelola jadwal kegiatan belajar mengajar dengan mudah
                        </p>
                    </div>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Tambah Jadwal
                    </Button>
                </div>

                <ScheduleFilters
                    filterOptions={filterOptions}
                    filters={filters}
                    onFilterChange={setFilters}
                />

                <Tabs value={view} onValueChange={(v) => setView(v as any)}>
                    <TabsList className="grid w-full grid-cols-2 max-w-xs">
                        <TabsTrigger value="calendar">Kalender</TabsTrigger>
                        <TabsTrigger value="table">Tabel</TabsTrigger>
                    </TabsList>

                    <TabsContent value="calendar" className="mt-4">
                        <ScheduleCalendar
                            schedules={filteredSchedules}
                            onEdit={handleEdit}
                        />
                    </TabsContent>

                    <TabsContent value="table" className="mt-4">
                        <ScheduleTable
                            schedules={filteredSchedules}
                            onEdit={handleEdit}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <ScheduleForm
                open={isFormOpen}
                onClose={handleFormClose}
                schedule={selectedSchedule}
                filterOptions={filterOptions}
            />
        </AuthenticatedLayout>
    );
};

export default SchedulePage;
