"use client";

import { useState } from "react";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

type WeeklyDatePickerProps = {
    value?: Date;
    onChange?: (range: { start: Date; end: Date }) => void;
    label?: string;
};

export default function WeeklyDatePicker({
    value,
    onChange,
    label = "",
}: WeeklyDatePickerProps) {
    const [date, setDate] = useState<Date | undefined>(value);

    const start = date ? startOfWeek(date, { weekStartsOn: 1 }) : null;
    const end = date ? endOfWeek(date, { weekStartsOn: 1 }) : null;

    const formatted =
        start && end
            ? `${format(start, "dd MMMM", { locale: id })} - ${format(
                  end,
                  "dd MMMM yyyy",
                  { locale: id }
              )}`
            : "";

    return (
        <div className="flex flex-col space-y-1.5">
            {label && <span className="text-sm font-medium">{label}</span>}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatted || <span>Pilih minggu</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        lang="id"
                        locale={id}
                        mode="single"
                        selected={date}
                        onSelect={(selected) => {
                            if (!selected) return;
                            setDate(selected);
                            const startWeek = startOfWeek(selected, {
                                weekStartsOn: 1,
                            });
                            const endWeek = endOfWeek(selected, {
                                weekStartsOn: 1,
                            });
                            onChange?.({ start: startWeek, end: endWeek });
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
