import * as React from "react";
import { format, parse, setMonth, setYear } from "date-fns";
import { id } from "date-fns/locale";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";

type MonthlyDatePickerProps = {
    value?: string;
    onChange?: (date: string) => void;
};

const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(2000, i, 1), "MMMM", { locale: id })
);

const years = Array.from({ length: 50 }, (_, i) => 2000 + i);

export function MonthlyDatePicker({ value, onChange }: MonthlyDatePickerProps) {
    const initialDate = value
        ? parse(value, "yyyy-MM-dd", new Date())
        : new Date();
    const [selectedDate, setSelectedDate] = React.useState<Date>(initialDate);
    const [open, setOpen] = React.useState(false);

    const handleMonthChange = (monthIndex: number) => {
        const updated = setMonth(selectedDate, monthIndex);
        setSelectedDate(updated);
        onChange?.(format(updated, "yyyy-MM-dd"));
    };

    const handleYearChange: any = (year: number) => {
        const updated = setYear(selectedDate, year);
        setSelectedDate(updated);
        onChange?.(format(updated, "yyyy-MM-dd"));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                >
                    {selectedDate ? (
                        format(selectedDate, "MMMM yyyy", { locale: id })
                    ) : (
                        <span>Pilih Bulan</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] space-y-3">
                <div className="space-y-2">
                    <Label className="block text-sm font-medium">
                        Pilih Bulan
                    </Label>
                    <Select
                        value={String(selectedDate.getMonth())}
                        onValueChange={(e) => handleMonthChange(parseInt(e))}
                    >
                        <SelectTrigger className="w-full border rounded-md px-3 py-2">
                            <SelectValue placeholder="Pilih Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                            {months.map((month, index) => (
                                <SelectItem key={index} value={String(index)}>
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="block text-sm font-medium">
                        Pilih Tahun
                    </Label>
                    <Select
                        value={String(selectedDate.getFullYear())}
                        onValueChange={(e) => handleYearChange(parseInt(e))}
                    >
                        <SelectTrigger className="w-full border rounded-md px-3 py-2">
                            <SelectValue placeholder="Pilih Tahun" />
                        </SelectTrigger>
                        <SelectContent>
                            {years.map((year) => (
                                <SelectItem key={year} value={String(year)}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </PopoverContent>
        </Popover>
    );
}
