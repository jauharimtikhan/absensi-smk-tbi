// components/ImageUploader.tsx
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // pastikan lo punya util cn

type ImageUploaderProps = {
    name: string;
    label?: string;
    onChange?: (file: File | null) => void;
    className?: string;
    defaultImageUrl?: string; // kalau mau edit
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    name,
    label = "Upload Image",
    onChange,
    className,
    defaultImageUrl,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(
        defaultImageUrl ?? null
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }

        onChange?.(file);
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Label htmlFor={name}>{label}</Label>

            {preview && (
                <div className="rounded-md overflow-hidden border aspect-video bg-muted">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full max-w-[200px] h-full object-contain mx-auto"
                    />
                </div>
            )}

            <Input
                id={name}
                name={name}
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={inputRef}
            />

            <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
            >
                Pilih Gambar
            </Button>
        </div>
    );
};
