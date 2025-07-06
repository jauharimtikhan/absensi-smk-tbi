import React, { InputHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    rightcontent?: React.ReactNode;
    hint?: string;
}
export default function InputForm({ ...props }: InputFormProps) {
    return (
        <div className="mb-3 flex flex-col items-start">
            <Label htmlFor={props.id} className="mb-2">
                {props.label || ""}
            </Label>
            {props.hint && (
                <p className="text-xs font-regular text-gray-500 dark:text-gray-400 my-1">
                    {props.hint}
                </p>
            )}
            {props.rightcontent ? (
                <div className="flex items-center w-full gap-x-2">
                    <Input {...props} className="flex flex-1" />
                    {props.rightcontent}
                </div>
            ) : (
                <>
                    <Input {...props} />
                </>
            )}
            {props.error && (
                <span className="text-red-500 text-sm mt-1">{props.error}</span>
            )}
        </div>
    );
}
