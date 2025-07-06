import React, { useState, useRef, FormEvent } from "react";
import * as XLSX from "xlsx";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import FileInput from "./ui/FileInput";
import Dropzone from "./ui/dropzone";
import ButtonForm from "./button-form";
import { SendHorizonal } from "lucide-react";
import { useForm } from "@inertiajs/react";

export default function ExcelPreviewModal() {
    const [open, setOpen] = useState(false);
    const [sheets, setSheets] = useState<string[]>([]);
    const [sheetData, setSheetData] = useState<Record<string, any[][]>>({});
    const [selectedSheet, setSelectedSheet] = useState<string>("");
    const [filename, setFilename] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const form = useForm<{
        file: File | null;
    }>({
        file: null,
    });
    const cleanData = (data: any[][]) =>
        data.filter((row) =>
            row.some(
                (cell) => cell !== null && cell !== undefined && cell !== ""
            )
        );

    const handleFile = (files: File[] | null) => {
        const file = files?.[0];
        if (!file) return;
        form.setData("file", file);
        setFilename(file.name);
        const reader = new FileReader();

        reader.onload = (evt) => {
            const data = evt.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });

            const allSheets: Record<string, any[][]> = {};
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                ///@ts-ignore
                allSheets[sheetName] = json;
            });

            setSheetData(allSheets);
            setSheets(workbook.SheetNames);
            setSelectedSheet(workbook.SheetNames[0]);
            setOpen(true);
        };

        reader.readAsBinaryString(file);
    };

    const currentRows = cleanData(sheetData[selectedSheet] || []);

    const handleUpload = (e: FormEvent) => {
        e.preventDefault();
        form.post(route("siswa.import"));
    };
    return (
        <div className="space-y-4">
            {!open && <Dropzone onDrop={handleFile} accept=".xlsx,.xls" />}
            {/* Sheet selector */}
            {sheets.length > 1 && (
                <div className="flex items-center gap-4 mb-4">
                    <Label>Pilih Sheet:</Label>
                    <Select
                        value={selectedSheet}
                        onValueChange={setSelectedSheet}
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Pilih Sheet" />
                        </SelectTrigger>
                        <SelectContent>
                            {sheets.map((sheet) => (
                                <SelectItem key={sheet} value={sheet}>
                                    {sheet}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Table Preview */}
            {currentRows.length > 0 ? (
                <div className="overflow-auto max-h-[60vh] border rounded">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0">
                            <tr>
                                {currentRows[0].map((col: any, i: number) => (
                                    <th key={i} className="p-2 border">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentRows
                                .slice(1)
                                .map((row: any[], i: number) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j} className="p-2 border">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted-foreground">
                    Sheet ini kosong atau tidak ada data.
                </p>
            )}
            <form
                className="mt-6 flex justify-end"
                encType="multipart/form-data"
                onSubmit={handleUpload}
            >
                <ButtonForm
                    loading={form.processing}
                    type="submit"
                    label="Upload"
                    righticon={<SendHorizonal />}
                />
            </form>
        </div>
    );
}
