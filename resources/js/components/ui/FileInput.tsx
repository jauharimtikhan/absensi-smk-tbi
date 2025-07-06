import React, { useRef, useState } from "react";
import { Button } from "./button";

export interface FileInputProps {
    label?: string;
    accept?: string;
    onChange?: (file: File | null) => void;
    className?: string;
}

const FileInput: React.FC<FileInputProps> = ({
    label = "Pilih Berkas",
    accept,
    onChange,
    className = "",
}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState("Tidak ada file dipilih");

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setFileName(file ? file.name : "Tidak ada file dipilih");
        onChange?.(file);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <Button type="button" onClick={handleClick} variant={"outline"}>
                {label}
            </Button>
            <span className="text-gray-700 text-sm">{fileName}</span>
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept={accept}
                onChange={handleChange}
            />
        </div>
    );
};

export default FileInput;
