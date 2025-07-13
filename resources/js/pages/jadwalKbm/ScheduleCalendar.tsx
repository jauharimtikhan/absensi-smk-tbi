// resources/js/Components/Schedule/ScheduleCalendar.tsx
import React, { useState } from "react";
import { Schedule } from "@/types/schedule";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit, MoreVertical } from "lucide-react";

interface ScheduleCalendarProps {
    schedules: Schedule[];
    onEdit: (schedule: Schedule) => void;
}

const ScheduleCalendar: React.FC<ScheduleCalendarProps> = ({
    schedules,
    onEdit,
}) => {
    console.log(schedules);

    const [date, setDate] = useState<Date>(new Date());

    const getSchedulesForDay = (day: Date) => {
        let dayName = format(day, "EEEE", { locale: id }).toLowerCase();

        return schedules.filter((schedule) => {
            let scheduleDay =
                schedule.hari.toLowerCase() === "ahad"
                    ? "minggu"
                    : schedule.hari.toLowerCase();
            return scheduleDay === dayName;
        });
    };

    const daySchedules = getSchedulesForDay(date);

    const getDayClass = (day: Date) => {
        const hasSchedules = getSchedulesForDay(day).length > 0;
        return hasSchedules ? "bg-green-50 hover:bg-green-100" : "";
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle className="text-lg">
                            {format(date, "MMMM yyyy", { locale: id })}
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setDate((prev) => {
                                        const newDate = new Date(prev);
                                        newDate.setMonth(
                                            newDate.getMonth() - 1
                                        );
                                        return newDate;
                                    })
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setDate(new Date())}
                            >
                                Hari Ini
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setDate((prev) => {
                                        const newDate = new Date(prev);
                                        newDate.setMonth(
                                            newDate.getMonth() + 1
                                        );
                                        return newDate;
                                    })
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(day) => day && setDate(day)}
                            className="rounded-md border"
                            modifiers={{
                                hasSchedules: (day) =>
                                    getSchedulesForDay(day).length > 0,
                            }}
                            modifiersClassNames={{
                                hasSchedules:
                                    "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:rounded-full after:bg-primary",
                            }}
                            locale={id}
                        />
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Jadwal{" "}
                            {format(date, "EEEE, d MMMM yyyy", { locale: id })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {daySchedules.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Tidak ada jadwal untuk hari ini
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {daySchedules.map((schedule) => (
                                    <div
                                        key={schedule.id}
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium">
                                                    {
                                                        schedule.mata_pelajarans
                                                            .nama_mapel
                                                    }
                                                    <span className="text-muted-foreground text-sm ml-2">
                                                        (
                                                        {
                                                            schedule
                                                                .mata_pelajarans
                                                                .kode_mapel
                                                        }
                                                        )
                                                    </span>
                                                </div>
                                                <div className="text-sm mt-1">
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
                                                <div className="text-sm mt-1">
                                                    {schedule.kelas.nama_kelas}
                                                </div>
                                            </div>

                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-48 p-2">
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            onEdit(schedule)
                                                        }
                                                    >
                                                        <Edit className="mr-2 h-4 w-4" />{" "}
                                                        Edit
                                                    </Button>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="mt-3 flex items-center">
                                            <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                                                {schedule.guru.profile_guru?.nama_guru
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="ml-2 text-sm">
                                                {
                                                    schedule.guru.profile_guru
                                                        ?.nama_guru
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ScheduleCalendar;
