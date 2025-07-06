import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn, translatedMonth } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { DayPicker, DropdownProps, useDayPicker } from "react-day-picker";

type DatePickerProps = {
    placeholder?: string;
    date?: Date | string;
    onSelected: (value: string) => void;
    todayAction?: () => void;
};
type CombinedProps = DatePickerProps & React.ComponentProps<typeof DayPicker>;
export function DatePicker({
    date,
    placeholder,
    todayAction,
    onSelected,
    ...props
}: CombinedProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {date ? (
                        format(date, "EEEE, dd MMM yyyy", { locale: id })
                    ) : (
                        <span>{placeholder || "Pilih Tanggal"}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <div className="p-2 w-full">
                    <Button onClick={todayAction} className="w-full">
                        Hari Ini
                    </Button>
                </div>
                <Calendar
                    mode={props.mode}
                    lang="id"
                    locale={id}
                    components={{
                        Dropdown: CustomSelectDropdown,
                    }}
                    onSelect={(value: any) =>
                        onSelected(
                            format(value.toISOString(), "yyyy-MM-dd", {
                                locale: id,
                            }).toString()
                        )
                    }
                    formatters={{
                        formatMonthDropdown(month, dateLib) {
                            return translatedMonth[month.getMonth()];
                        },
                    }}
                    {...props}
                />
            </PopoverContent>
        </Popover>
    );
}

export function CustomSelectDropdown(props: DropdownProps) {
    const { options, value, onChange } = props;

    const handleValueChange = (newValue: string) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: newValue,
                },
            } as React.ChangeEvent<HTMLSelectElement>;

            onChange(syntheticEvent);
        }
    };

    return (
        <Select value={value?.toString()} onValueChange={handleValueChange}>
            <SelectTrigger>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options?.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value.toString()}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
