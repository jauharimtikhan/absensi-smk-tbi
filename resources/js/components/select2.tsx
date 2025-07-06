import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Option {
    label: string;
    value: string | number;
}

interface Select2Props {
    options: Option[];
    value: string | number | (string | number)[];
    onChange: (value: any) => void;
    placeholder?: string;
    searchable?: boolean;
    multiple?: boolean;
    onRemove?: (value: any) => void;
}

export const Select2: React.FC<Select2Props> = ({
    options,
    value,
    onChange,
    placeholder = "Pilih",
    searchable = true,
    multiple = false,
    onRemove,
}) => {
    const [search, setSearch] = React.useState("");

    const filteredOptions = (options || []).filter(
        (opt) =>
            opt.label.toLowerCase().includes(search.toLowerCase()) &&
            (!multiple ||
                !(Array.isArray(value) ? value : []).includes(opt.value))
    );

    const handleAdd = (val: string) => {
        if (multiple) {
            const current = Array.isArray(value) ? value : [];
            if (!current.includes(val)) {
                onChange([...current, val]);
            }
        } else {
            onChange(val);
        }
    };

    const handleRemove = (val: string | number) => {
        if (multiple) {
            const newValue = (value as (string | number)[]).filter(
                (v) => v !== val
            );
            onChange(newValue);
            onRemove?.(val);
        }
    };

    const selectedValues = multiple ? (value as (string | number)[]) : [];
    const selectedLabel = !multiple
        ? options.find((o) => o.value === value)?.label
        : undefined;

    return (
        <div className="w-full space-y-1">
            {multiple && selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {selectedValues.map((val) => {
                        const option = options.find(
                            (o) => String(o.value) === val
                        );
                        return (
                            <div
                                key={val}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-600 text-sm rounded-full"
                            >
                                <span className="text-gray-700 dark:text-white">
                                    {option?.label ?? val}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemove(val)}
                                    className="text-blue-600 dark:text-blue-100 hover:text-red-600 dark:hover:text-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            <Select
                value={!multiple ? String(value) : ""}
                onValueChange={handleAdd}
            >
                <SelectTrigger>
                    {!multiple ? (
                        <SelectValue placeholder={placeholder}>
                            {selectedLabel}
                        </SelectValue>
                    ) : (
                        <span className="text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                </SelectTrigger>
                <SelectContent>
                    {searchable && (
                        <div className="p-2">
                            <Input
                                placeholder="Cari..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    )}
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={String(option.value)}
                            >
                                {option.label}
                            </SelectItem>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-muted-foreground">
                            Tidak ada hasil
                        </div>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};
