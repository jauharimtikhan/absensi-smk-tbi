import React, { useCallback, useState } from "react";

export interface DropzoneProps {
    onDrop: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    label?: string;
    className?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({
    onDrop,
    accept = "",
    multiple = false,
    label = "Seret dan lepas berkas ke sini atau klik untuk memilih",
    className = "",
}) => {
    const [dragging, setDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        const files = Array.from(e.dataTransfer.files);
        onDrop(files);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        onDrop(files);
    };

    const handleClick = () => {
        document.getElementById("hidden-dropzone-input")?.click();
    };

    return (
        <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`cursor-pointer border-2 border-dashed rounded-md p-6 text-center transition 
        ${
            dragging
                ? "border-blue-500 bg-blue-50 dark:border-indigo-500 dark:bg-gray-500"
                : "border-gray-300 bg-white dark:bg-gray-700 dark:border-gray-600"
        } 
        ${className}`}
        >
            <p className="text-gray-700 dark:text-gray-200">{label}</p>
            <input
                id="hidden-dropzone-input"
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleFileSelect}
                className="hidden"
            />
        </div>
    );
};

export default Dropzone;
