import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonFormProps extends ButtonProps {
    loading?: boolean;
    righticon?: React.ReactNode;
    lefticon?: React.ReactNode;
    label?: string;
}

export default function ButtonForm({
    loading,
    righticon,
    lefticon,
    label,
    ...props
}: ButtonFormProps) {
    if (loading) {
        return (
            <Button {...props} disabled={true}>
                <Loader2Icon className="animate-spin" />
            </Button>
        );
    } else {
        if (righticon) {
            return (
                <Button
                    {...props}
                    className={cn("flex items-center gap-2", props.className)}
                >
                    {label}
                    {righticon}
                </Button>
            );
        } else {
            return (
                <Button
                    {...props}
                    className={cn("flex items-center gap-2", props.className)}
                >
                    {lefticon}
                    {label}
                </Button>
            );
        }
    }
}
